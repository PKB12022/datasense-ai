import pandas as pd
import numpy as np
import io
import matplotlib
matplotlib.use('Agg') # Essential for web servers
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from typing import Dict, Any, List

class DataAnalysisService:
    def __init__(self, file_content: bytes, filename: str):
        self.filename = filename
        
        # Load into pandas based on extension
        try:
            if filename.endswith(".csv"):
                self.df = pd.read_csv(io.BytesIO(file_content), on_bad_lines='skip', engine='python', encoding_errors='ignore')
            elif filename.endswith(".xlsx"):
                self.df = pd.read_excel(io.BytesIO(file_content))
            else:
                raise ValueError("Unsupported file format")
        except Exception as e:
            raise ValueError(f"Could not parse data file. Please ensure it is a valid CSV or Excel file. Error: {str(e)}")

    def get_basic_stats(self) -> Dict[str, Any]:
        """Returns row count, column count, and data types."""
        return {
            "row_count": int(self.df.shape[0]),
            "column_count": int(self.df.shape[1]),
            "columns": self.df.dtypes.astype(str).to_dict()
        }

    def get_missing_values(self) -> Dict[str, int]:
        """Returns count of missing values per column."""
        missing = self.df.isnull().sum()
        return missing[missing > 0].to_dict()

    def get_descriptive_stats(self) -> Dict[str, Any]:
        """Returns summary statistics for numerical columns."""
        numerical_df = self.df.select_dtypes(include=[np.number])
        if numerical_df.empty:
            return {}
            
        # replace NaN with None for JSON serialization
        stats = numerical_df.describe().replace({np.nan: None}).to_dict()
        return stats

    def get_correlation_matrix(self) -> Dict[str, Dict[str, float]]:
        """Returns the correlation matrix for numerical columns."""
        numerical_df = self.df.select_dtypes(include=[np.number])
        if numerical_df.shape[1] < 2:
            return {}
            
        corr_matrix = numerical_df.corr().replace({np.nan: None}).to_dict()
        return corr_matrix

    def recommend_ml_models(self) -> Dict[str, Any]:
        """Simple heuristic to recommend ML models based on the dataset."""
        # Try to guess the target column (last column usually, or specific names)
        cols = self.df.columns.str.lower()
        target_candidates = [c for c in cols if c in ['target', 'label', 'class', 'price', 'churn', 'status']]
        
        target_col = None
        if target_candidates:
            target_col = self.df.columns[cols.get_loc(target_candidates[0])]
        elif len(self.df.columns) > 1:
            target_col = self.df.columns[-1]

        if not target_col:
            return {
                "problem_type": "Clustering",
                "recommended_models": ["K-Means", "DBSCAN", "Hierarchical Clustering"],
                "reasoning": "No clear target variable was found, suggesting an unsupervised learning problem."
            }

        target_series = self.df[target_col]
        
        # Check if classification or regression
        if pd.api.types.is_numeric_dtype(target_series):
            unique_vals = target_series.nunique()
            if unique_vals < 20: # Likely categorical/classification
                return {
                    "problem_type": "Classification",
                    "target_column": target_col,
                    "recommended_models": ["Random Forest Classifier", "Logistic Regression", "XGBoost"],
                    "reasoning": f"The target column '{target_col}' is numerical but has very few unique values ({unique_vals}), indicating a likely classification problem."
                }
            else:
                return {
                    "problem_type": "Regression",
                    "target_column": target_col,
                    "recommended_models": ["Linear Regression", "Random Forest Regressor", "XGBoost Regressor"],
                    "reasoning": f"The target column '{target_col}' has continuous numerical values, making this a regression problem."
                }
        else:
            return {
                "problem_type": "Classification",
                "target_column": target_col,
                "recommended_models": ["Random Forest Classifier", "Logistic Regression", "Support Vector Machine"],
                "reasoning": f"The target column '{target_col}' contains categorical (text) data, which is typical for classification tasks."
            }

    def generate_visualizations(self) -> Dict[str, bytes]:
        """Dynamically generates relevant charts and returns them as byte streams."""
        visuals = {}
        
        # 1. Missing Values Bar Chart (if any exist)
        missing = self.df.isnull().sum()
        missing = missing[missing > 0]
        if not missing.empty:
            if len(missing) > 20:
                missing = missing.nlargest(20)
            plt.figure(figsize=(8, 3))
            sns.barplot(x=missing.index, y=missing.values, palette="Reds_r")
            plt.title("Top 20 Missing Values per Column" if len(self.df.columns) > 20 else "Missing Values per Column")
            plt.xticks(rotation=45, ha='right')
            plt.tight_layout()
            buf = io.BytesIO()
            plt.savefig(buf, format='png', dpi=100)
            plt.close()
            visuals['missing_values_chart'] = buf.getvalue()
            
        # 2. Correlation Heatmap (if enough numeric columns)
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
            
        # 3. Boxplots for Outliers (Top 4 numeric columns)
        if num_df.shape[1] > 0:
            cols_to_plot = num_df.columns[:4]
            plt.figure(figsize=(8, 3))
            for i, col in enumerate(cols_to_plot):
                plt.subplot(1, len(cols_to_plot), i+1)
                sns.boxplot(y=self.df[col], color="skyblue")
                plt.title(col)
                plt.ylabel("")
            plt.tight_layout()
            buf = io.BytesIO()
            plt.savefig(buf, format='png', dpi=100)
            plt.close()
            visuals['outlier_boxplots'] = buf.getvalue()
            
        # 4. Target Distribution & Feature Importance
        ml_rec = self.recommend_ml_models()
        target_col = ml_rec.get("target_column")
        problem_type = ml_rec.get("problem_type")
        
        if target_col and target_col in self.df.columns:
            # Target Distribution
            plt.figure(figsize=(8, 3))
            series = self.df[target_col]
            if pd.api.types.is_numeric_dtype(series) and series.nunique() > 10:
                sns.histplot(series, kde=True, color="blue")
                plt.title(f"Distribution of Target: {target_col}")
            else:
                # If too many categories, just plot top 20
                if series.nunique() > 20:
                    top_categories = series.value_counts().nlargest(20).index
                    sns.countplot(x=series[series.isin(top_categories)], palette="viridis", order=top_categories)
                    plt.title(f"Top 20 Classes of Target: {target_col}")
                else:
                    sns.countplot(x=series, palette="viridis")
                    plt.title(f"Class Balance of Target: {target_col}")
                plt.xticks(rotation=45, ha='right')
            
            try:
                plt.tight_layout()
            except Exception:
                pass # Ignore if tight layout fails
            buf = io.BytesIO()
            plt.savefig(buf, format='png', dpi=100)
            plt.close()
            visuals['target_distribution'] = buf.getvalue()
            
            # Feature Importance using Random Forest
            try:
                # Prepare data: drop rows with NaNs in target, fill NaNs in features, encode categoricals
                df_clean = self.df.dropna(subset=[target_col]).copy()
                # Subsample data to max 2000 rows for speed
                if len(df_clean) > 2000:
                    df_clean = df_clean.sample(n=2000, random_state=42)
                    
                X = df_clean.drop(columns=[target_col])
                y = df_clean[target_col]
                
                # Encode target if classification
                if problem_type == "Classification" and not pd.api.types.is_numeric_dtype(y):
                    y = LabelEncoder().fit_transform(y)
                
                # Fill missing and encode categorical features
                for col in X.columns:
                    if pd.api.types.is_numeric_dtype(X[col]):
                        # Fill numeric NaNs with median, fallback to 0
                        X[col] = X[col].fillna(X[col].median()).fillna(0)
                    else:
                        # Encode all non-numeric (object, string, category)
                        X[col] = LabelEncoder().fit_transform(X[col].astype(str))
                        
                if not X.empty:
                    model = RandomForestClassifier(n_estimators=50, random_state=42) if problem_type == "Classification" else RandomForestRegressor(n_estimators=50, random_state=42)
                    model.fit(X, y)
                    
                    importances = pd.Series(model.feature_importances_, index=X.columns).sort_values(ascending=False).head(10)
                    
                    plt.figure(figsize=(8, 4))
                    sns.barplot(x=importances.values, y=importances.index, palette="mako")
                    plt.title("Feature Importance Ranking")
                    plt.xlabel("Importance Score")
                    plt.tight_layout()
                    buf = io.BytesIO()
                    plt.savefig(buf, format='png', dpi=100)
                    plt.close()
                    visuals['feature_importance'] = buf.getvalue()
            except Exception as e:
                print(f"Failed to generate feature importance: {e}")
            
        return visuals

    def run_full_analysis(self) -> Dict[str, Any]:
        """Runs all analysis pipelines and returns a combined dictionary."""
        return {
            "basic_stats": self.get_basic_stats(),
            "missing_values": self.get_missing_values(),
            "descriptive_stats": self.get_descriptive_stats(),
            "correlation_matrix": self.get_correlation_matrix(),
            "ml_recommendation": self.recommend_ml_models()
        }
