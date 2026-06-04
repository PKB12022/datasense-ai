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
        
        for col in self.df.columns:
            if 'date' in col or 'time' in col:
                profile["date_columns"].append(col)
                continue
            if self.df[col].dtype == 'object':
                try:
                    pd.to_datetime(self.df[col].dropna().head(10))
                    profile["date_columns"].append(col)
                except:
                    pass

        num_cols = self.df.select_dtypes(include=[np.number]).columns
        for col in num_cols:
            Q1 = self.df[col].quantile(0.25)
            Q3 = self.df[col].quantile(0.75)
            IQR = Q3 - Q1
            outliers = ((self.df[col] < (Q1 - 1.5 * IQR)) | (self.df[col] > (Q3 + 1.5 * IQR))).sum()
            profile["outlier_counts"][col] = int(outliers)

        return profile

    def detect_target(self) -> Dict[str, Any]:
        """Step 3: Target Detection Engine (Penalty System)"""
        target_boosts = {'price': 100, 'churn': 100, 'fraud': 100, 'sales': 80, 'revenue': 80, 'income': 60, 'target': 100, 'label': 100, 'class': 80, 'status': 60, 'approved': 60, 'default': 80, 'attrition': 80}
        target_penalties = {'city': -40, 'state': -40, 'country': -40, 'gender': -40, 'name': -80, 'email': -100, 'phone': -100, 'address': -80, 'id': -100, 'uuid': -100, 'timestamp': -100, 'date': -100}
        
        scores = {}
        for col in self.df.columns:
            score = 0
            
            # Apply Boosts
            for k, v in target_boosts.items():
                if k in col: score += v
                
            # Apply Penalties
            for k, v in target_penalties.items():
                if k in col: score += v
            
            unique_count = self.df[col].nunique()
            if unique_count == self.row_count: score -= 100 
            if unique_count == 1: score -= 100
            
            if unique_count == 2: score += 30
            
            if pd.api.types.is_numeric_dtype(self.df[col]) and unique_count > 10:
                score += 20
                
            scores[col] = score

        if not scores:
            return {"target_column": None, "confidence": "Low (0%)", "reasoning": "No valid columns found."}

        best_col = max(scores, key=scores.get)
        best_score = scores[best_col]
        
        if best_score < 50:
            return {
                "target_column": None, 
                "confidence": f"Low ({max(0, best_score)}%)", 
                "reasoning": f"Best candidate '{best_col}' scored too low ({best_score}). No obvious prediction target detected."
            }
            
        confidence_pct = min(99, best_score)
        return {
            "target_column": best_col,
            "confidence": f"High ({confidence_pct}%)" if best_score >= 80 else f"Medium ({confidence_pct}%)",
            "reasoning": f"Column '{best_col}' scored {best_score} points in the target penalty/boost system."
        }

    def detect_analysis_mode(self, target_info: Dict[str, Any], date_cols: List[str]) -> Dict[str, Any]:
        """Step 4: Analysis Mode Detection"""
        num_cols = self.df.select_dtypes(include=[np.number]).columns
        has_numeric = len(num_cols) > 0
        target_col = target_info.get("target_column")
        
        # Condition 1: Predictive
        if target_col and target_col in self.df.columns:
            return {
                "mode": "Predictive Analytics",
                "confidence": "High (95%)",
                "reasoning": f"A strong prediction target ('{target_col}') was detected.",
                "requires_ml": True
            }
            
        # Condition 2: Time Series (Needs date AND metric)
        if date_cols and has_numeric:
            return {
                "mode": "Time Series Analytics",
                "confidence": "High (88%)",
                "reasoning": f"Dataset contains a date column ('{date_cols[0]}') and measurable numeric metrics.",
                "requires_ml": True
            }
            
        # Condition 3: Segmentation
        if self.row_count > 1000 and len(self.df.columns) > 5 and has_numeric:
            return {
                "mode": "Segmentation Analytics",
                "confidence": "Medium (75%)",
                "reasoning": "No target detected, but high dataset volume and numeric features suggest clustering/segmentation.",
                "requires_ml": False
            }
            
        # Fallback: Business Intelligence
        return {
            "mode": "Business Intelligence",
            "confidence": "High (92%)",
            "reasoning": "No strong prediction target detected. Primary value comes from exploratory trends and categorical segment analysis.",
            "requires_ml": False
        }

    def detect_ml_strategy(self, mode_info: Dict[str, Any], target_col: str) -> Dict[str, Any]:
        """Step 5: ML Model Recommendation Engine"""
        if not mode_info.get("requires_ml"):
            return {
                "problem_type": "N/A",
                "recommended_models": ["None"],
                "reasoning": "Machine Learning is not recommended for this Analysis Mode."
            }
            
        if mode_info["mode"] == "Time Series Analytics":
            return {
                "problem_type": "Time Series Forecasting",
                "recommended_models": ["ARIMA", "Prophet", "XGBoost Time Features"],
                "reasoning": "Temporal data detected with numeric metrics suitable for forecasting."
            }
            
        target_series = self.df[target_col]
        is_numeric = pd.api.types.is_numeric_dtype(target_series)
        unique_vals = target_series.nunique()
        is_large_dataset = self.row_count > 10000

        if is_numeric and unique_vals > 20:
            models = ["XGBoost Regressor", "LightGBM"] if is_large_dataset else ["Linear Regression", "Random Forest Regressor"]
            return {
                "problem_type": "Regression",
                "target_column": target_col,
                "recommended_models": models,
                "reasoning": f"Target '{target_col}' is continuous numeric. Regression is appropriate."
            }
        else:
            models = ["XGBoost Classifier", "LightGBM Classifier"] if is_large_dataset else ["Logistic Regression", "Random Forest Classifier"]
            return {
                "problem_type": "Classification",
                "target_column": target_col,
                "recommended_models": models,
                "reasoning": f"Target '{target_col}' has low cardinality ({unique_vals}). Classification is appropriate."
            }

    def get_feature_intelligence(self, target_col: str) -> Dict[str, Any]:
        intelligence = {}
        for col in self.df.columns:
            if col == target_col: continue
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
                
            intelligence[col] = {
                "classification": classification,
                "reasoning": reason,
                "missing_pct": f"{missing_pct*100:.1f}%"
            }
        return intelligence

    def get_correlation_matrix(self) -> Dict[str, Dict[str, float]]:
        num_df = self.df.select_dtypes(include=[np.number])
        if num_df.shape[1] < 3: return {} # V3: Only if >= 3
        return num_df.corr().replace({np.nan: None}).to_dict()

    def generate_visualizations(self) -> Dict[str, bytes]:
        """V3 Intelligent Visual Culling"""
        visuals = {}
        
        # 1. Missing Values (Only if they exist)
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
            
        # 2. Correlation Heatmap (Only if >= 3 num columns)
        num_df = self.df.select_dtypes(include=[np.number])
        if num_df.shape[1] >= 3:
            plt.figure(figsize=(8, 5))
            corr = num_df.corr()
            sns.heatmap(corr, annot=True, cmap="coolwarm", fmt=".2f", vmin=-1, vmax=1)
            plt.title("Feature Correlation Heatmap")
            plt.tight_layout()
            buf = io.BytesIO()
            plt.savefig(buf, format='png', dpi=100)
            plt.close()
            visuals['correlation_heatmap'] = buf.getvalue()
            
        # 3. Boxplots (Only if meaningful outliers exist)
        profile = self.get_dataset_profile()
        cols_with_outliers = [k for k, v in profile["outlier_counts"].items() if v > (self.row_count * 0.01)]
        if cols_with_outliers:
            cols_to_plot = cols_with_outliers[:2] # Max 2
            plt.figure(figsize=(8, 3))
            for i, col in enumerate(cols_to_plot):
                plt.subplot(1, len(cols_to_plot), i+1)
                sns.boxplot(y=self.df[col], color="skyblue")
                plt.title(f"Outliers: {col}")
                plt.ylabel("")
            plt.tight_layout()
            buf = io.BytesIO()
            plt.savefig(buf, format='png', dpi=100)
            plt.close()
            visuals['outlier_boxplots'] = buf.getvalue()
            
        # 4. Numerical Distributions (Top 2 by variance)
        if num_df.shape[1] > 0:
            variances = num_df.var().sort_values(ascending=False)
            top_num_cols = variances.index[:2]
            for i, col in enumerate(top_num_cols):
                plt.figure(figsize=(8, 3))
                sns.histplot(self.df[col], kde=True, color="blue")
                plt.title(f"Distribution: {col.title()}")
                plt.tight_layout()
                buf = io.BytesIO()
                plt.savefig(buf, format='png', dpi=100)
                plt.close()
                visuals[f'num_dist_{i}'] = buf.getvalue()
            
        # 5. Categorical Distributions (Top 2 Categorical columns)
        cat_df = self.df.select_dtypes(exclude=[np.number])
        cat_cols = [col for col in cat_df.columns if self.df[col].nunique() < 20 and 'date' not in col and 'time' not in col]
        if cat_cols:
            for i, col in enumerate(cat_cols[:2]):
                plt.figure(figsize=(8, 3))
                top_cats = self.df[col].value_counts().nlargest(5)
                sns.barplot(x=top_cats.values, y=top_cats.index, palette="viridis") # Horizontal for readability
                plt.title(f"Top Categories: {col.title()}")
                plt.tight_layout()
                buf = io.BytesIO()
                plt.savefig(buf, format='png', dpi=100)
                plt.close()
                visuals[f'cat_dist_{i}'] = buf.getvalue()
            
        return visuals

    def run_full_analysis(self) -> Dict[str, Any]:
        profile = self.get_dataset_profile()
        target_info = self.detect_target()
        mode_info = self.detect_analysis_mode(target_info, profile["date_columns"])
        ml_info = self.detect_ml_strategy(mode_info, target_info.get("target_column"))
        
        return {
            "dataset_profile": profile,
            "target_detection": target_info,
            "analysis_mode": mode_info,
            "ml_strategy": ml_info,
            "feature_intelligence": self.get_feature_intelligence(target_info.get("target_column")),
            "correlation_matrix": self.get_correlation_matrix()
        }
