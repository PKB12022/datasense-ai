import pandas as pd
import numpy as np
import io
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from typing import Dict, Any, List

class DataAnalysisService:
    def __init__(self, file_content: bytes, filename: str):
        self.filename = filename
        try:
            if filename.endswith(".csv"):
                self.df = pd.read_csv(io.BytesIO(file_content), on_bad_lines='skip', engine='python', encoding_errors='ignore')
            elif filename.endswith(".xlsx"):
                self.df = pd.read_excel(io.BytesIO(file_content))
            else:
                raise ValueError("Unsupported file format")
        except Exception as e:
            raise ValueError(f"Could not parse data file. Error: {str(e)}")

        # Convert column names to lowercase for easier analysis
        self.original_columns = self.df.columns.tolist()
        self.df.columns = self.df.columns.str.lower()
        
        self.row_count = len(self.df)
        self.col_count = len(self.df.columns)

    def get_dataset_profile(self) -> Dict[str, Any]:
        """Step 1: Dataset Understanding Layer"""
        profile = {
            "row_count": self.row_count,
            "column_count": self.col_count,
            "columns": self.df.dtypes.astype(str).to_dict(),
            "missing_values": self.df.isnull().sum().to_dict(),
            "duplicate_rows": int(self.df.duplicated().sum()),
            "cardinality": self.df.nunique().to_dict(),
            "date_columns": [],
            "outlier_counts": {}
        }
        
        # Detect date columns
        for col in self.df.columns:
            if 'date' in col or 'time' in col:
                profile["date_columns"].append(col)
                continue
            # Try to infer datetime
            if self.df[col].dtype == 'object':
                try:
                    pd.to_datetime(self.df[col].dropna().head(10))
                    profile["date_columns"].append(col)
                except:
                    pass

        # Detect outliers using IQR for numerical columns
        num_cols = self.df.select_dtypes(include=[np.number]).columns
        for col in num_cols:
            Q1 = self.df[col].quantile(0.25)
            Q3 = self.df[col].quantile(0.75)
            IQR = Q3 - Q1
            outliers = ((self.df[col] < (Q1 - 1.5 * IQR)) | (self.df[col] > (Q3 + 1.5 * IQR))).sum()
            profile["outlier_counts"][col] = int(outliers)

        return profile

    def detect_target(self) -> Dict[str, Any]:
        """Step 3: Target Detection Engine"""
        target_keywords = ['price', 'churn', 'fraud', 'sales', 'revenue', 'income', 'target', 'label', 'class', 'status', 'approved', 'default', 'attrition']
        ignore_keywords = ['id', 'uuid', 'guid', 'timestamp', 'date', 'name', 'email', 'phone', 'address']
        
        scores = {}
        for col in self.df.columns:
            score = 0
            # Name meaning
            if any(k in col for k in target_keywords): score += 50
            if any(k in col for k in ignore_keywords): score -= 100
            
            # Cardinality
            unique_count = self.df[col].nunique()
            if unique_count == self.row_count: score -= 100 # Identifier
            if unique_count == 1: score -= 100 # Constant
            
            # Binary classification targets are very common
            if unique_count == 2: score += 30
            
            # Numeric targets (regression)
            if pd.api.types.is_numeric_dtype(self.df[col]) and unique_count > 10:
                score += 20
                
            scores[col] = score

        if not scores:
            return {"target_column": None, "confidence": "Low", "reasoning": "No valid columns found."}

        best_col = max(scores, key=scores.get)
        best_score = scores[best_col]
        
        if best_score < 0:
            return {"target_column": None, "confidence": "Low", "reasoning": "No column strongly resembles a target variable."}
            
        confidence = "High" if best_score >= 50 else "Medium"
        return {
            "target_column": best_col,
            "confidence": confidence,
            "reasoning": f"Column '{best_col}' scored highest based on naming conventions and cardinality."
        }

    def detect_problem_and_models(self, target_col: str, date_cols: List[str]) -> Dict[str, Any]:
        """Step 4 & 5: Problem Type and Model Recommendation"""
        if not target_col or target_col not in self.df.columns:
            if date_cols:
                return {
                    "problem_type": "Time Series EDA",
                    "recommended_models": ["ARIMA", "Prophet", "XGBoost Time Features"],
                    "reasoning": "No explicit target detected, but date columns suggest temporal analysis."
                }
            return {
                "problem_type": "Clustering / Anomaly Detection",
                "recommended_models": ["KMeans", "DBSCAN", "Isolation Forest", "One Class SVM"],
                "reasoning": "No target variable detected. Unsupervised learning is appropriate."
            }

        target_series = self.df[target_col]
        is_numeric = pd.api.types.is_numeric_dtype(target_series)
        unique_vals = target_series.nunique()
        is_large_dataset = self.row_count > 10000

        if is_numeric and unique_vals > 20:
            models = ["XGBoost Regressor", "LightGBM", "CatBoost"] if is_large_dataset else ["Linear Regression", "Random Forest Regressor", "XGBoost Regressor"]
            return {
                "problem_type": "Regression",
                "target_column": target_col,
                "recommended_models": models,
                "reasoning": f"Target '{target_col}' is continuous numeric. Using regression models suited for {'large' if is_large_dataset else 'small'} datasets."
            }
        else:
            models = ["XGBoost Classifier", "LightGBM Classifier", "Balanced Random Forest"] if is_large_dataset else ["Logistic Regression", "Random Forest Classifier", "XGBoost Classifier"]
            return {
                "problem_type": "Classification",
                "target_column": target_col,
                "recommended_models": models,
                "reasoning": f"Target '{target_col}' is categorical or has low cardinality ({unique_vals}). Using classification models."
            }

    def get_feature_intelligence(self, target_col: str) -> Dict[str, Any]:
        """Step 7: Feature Intelligence"""
        intelligence = {}
        for col in self.df.columns:
            if col == target_col:
                continue
                
            unique_count = self.df[col].nunique()
            missing_pct = self.df[col].isnull().sum() / self.row_count if self.row_count > 0 else 0
            
            classification = "Medium Importance"
            reason = "Standard feature"
            
            if unique_count == self.row_count or 'id' in col or 'uuid' in col:
                classification = "Identifier"
                reason = "Values are entirely unique; holds no predictive power."
            elif unique_count == 1:
                classification = "Noise"
                reason = "Constant value across all rows."
            elif missing_pct > 0.5:
                classification = "Noise"
                reason = f"Highly sparse ({missing_pct*100:.1f}% missing)."
            elif pd.api.types.is_numeric_dtype(self.df[col]) and self.df[col].var() == 0:
                classification = "Noise"
                reason = "Zero variance."
                
            intelligence[col] = {
                "classification": classification,
                "reasoning": reason,
                "missing_pct": f"{missing_pct*100:.1f}%",
                "unique_count": unique_count
            }
        return intelligence

    def get_correlation_matrix(self) -> Dict[str, Dict[str, float]]:
        num_df = self.df.select_dtypes(include=[np.number])
        if num_df.shape[1] < 2: return {}
        return num_df.corr().replace({np.nan: None}).to_dict()

    def generate_visualizations(self) -> Dict[str, bytes]:
        visuals = {}
        
        # 1. Missing Values
        missing = self.df.isnull().sum()
        missing = missing[missing > 0]
        if not missing.empty:
            plt.figure(figsize=(8, 3))
            sns.barplot(x=missing.index, y=missing.values, palette="Reds_r")
            plt.title("Missing Values per Column")
            plt.xticks(rotation=45, ha='right')
            plt.tight_layout()
            buf = io.BytesIO()
            plt.savefig(buf, format='png', dpi=100)
            plt.close()
            visuals['missing_values_chart'] = buf.getvalue()
            
        # 2. Correlation Heatmap
        num_df = self.df.select_dtypes(include=[np.number])
        if num_df.shape[1] >= 2:
            plt.figure(figsize=(8, 5))
            corr = num_df.corr()
            sns.heatmap(corr, annot=True, cmap="coolwarm", fmt=".2f", vmin=-1, vmax=1)
            plt.title("Feature Correlation Heatmap")
            plt.tight_layout()
            buf = io.BytesIO()
            plt.savefig(buf, format='png', dpi=100)
            plt.close()
            visuals['correlation_heatmap'] = buf.getvalue()
            
        # 3. Categorical Distributions (Top 2 Categorical columns)
        cat_df = self.df.select_dtypes(exclude=[np.number])
        cat_cols = [col for col in cat_df.columns if self.df[col].nunique() < 50 and 'date' not in col and 'time' not in col]
        if cat_cols:
            for i, col in enumerate(cat_cols[:2]):
                plt.figure(figsize=(8, 3))
                top_cats = self.df[col].value_counts().nlargest(10)
                sns.barplot(x=top_cats.index, y=top_cats.values, palette="viridis")
                plt.title(f"Top Categories: {col.title()}")
                plt.xticks(rotation=45, ha='right')
                plt.tight_layout()
                buf = io.BytesIO()
                plt.savefig(buf, format='png', dpi=100)
                plt.close()
                visuals[f'cat_dist_{i}'] = buf.getvalue()
            
        return visuals

    def run_full_analysis(self) -> Dict[str, Any]:
        profile = self.get_dataset_profile()
        target_info = self.detect_target()
        target_col = target_info.get("target_column")
        ml_info = self.detect_problem_and_models(target_col, profile["date_columns"])
        
        return {
            "dataset_profile": profile,
            "target_detection": target_info,
            "ml_strategy": ml_info,
            "feature_intelligence": self.get_feature_intelligence(target_col),
            "correlation_matrix": self.get_correlation_matrix()
        }
