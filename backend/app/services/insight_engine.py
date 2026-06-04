import pandas as pd
import numpy as np
from typing import Dict, Any, List

class InsightEngine:
    def __init__(self, df: pd.DataFrame, analysis_results: Dict[str, Any]):
        self.df = df
        self.df.columns = self.df.columns.str.lower()
        self.analysis_results = analysis_results

    def infer_domain(self) -> Dict[str, str]:
        """Step 2: Domain Inference"""
        cols = " ".join(self.df.columns).lower()
        domain_keywords = {
            "Real Estate": ['price', 'bedroom', 'bathroom', 'area', 'sqft', 'zipcode', 'property'],
            "Marketing / Customer Analytics": ['customer', 'acquisition', 'channel', 'signup', 'campaign', 'click'],
            "Human Resources": ['salary', 'department', 'attrition', 'employee', 'hire', 'role'],
            "Finance": ['transaction', 'amount', 'merchant', 'credit', 'balance', 'account'],
            "Healthcare": ['diagnosis', 'symptom', 'patient', 'treatment', 'blood', 'heart'],
            "E-Commerce / Sales": ['order', 'product', 'shipping', 'discount', 'cart', 'revenue']
        }
        
        scores = {domain: 0 for domain in domain_keywords}
        for domain, keywords in domain_keywords.items():
            for kw in keywords:
                if kw in cols:
                    scores[domain] += 1
                    
        best_domain = max(scores, key=scores.get)
        best_score = scores[best_domain]
        
        if best_score == 0:
            return {"domain": "General Business Analytics", "confidence": "Low", "reasoning": "No domain-specific keywords detected in column names."}
            
        confidence = "High" if best_score > 2 else "Medium"
        return {
            "domain": best_domain,
            "confidence": confidence,
            "reasoning": f"Detected {best_score} keywords associated with {best_domain}."
        }

    def calculate_data_quality(self) -> Dict[str, Any]:
        """Step 6: Data Quality Intelligence"""
        row_count = len(self.df)
        if row_count == 0: return {"Overall Data Health Score": "0/100"}
        
        profile = self.analysis_results.get("dataset_profile", {})
        total_cells = row_count * profile.get("column_count", 1)
        
        # Missing values score
        missing_count = sum(profile.get("missing_values", {}).values())
        missing_score = max(0, 100 - (missing_count / total_cells * 100)) if total_cells > 0 else 0
        
        # Duplicates score
        duplicate_count = profile.get("duplicate_rows", 0)
        uniqueness_score = max(0, 100 - (duplicate_count / row_count * 100))
        
        # Outlier score
        outlier_count = sum(profile.get("outlier_counts", {}).values())
        outlier_score = max(0, 100 - (outlier_count / total_cells * 100)) if total_cells > 0 else 0
        
        overall = int(np.mean([missing_score, uniqueness_score, outlier_score, 100]))
        
        return {
            "Missing Value Score": f"{int(missing_score)}/100",
            "Uniqueness Score": f"{int(uniqueness_score)}/100",
            "Outlier Score": f"{int(outlier_score)}/100",
            "Overall Data Health Score": f"{overall}/100",
            "Explanation": f"Data is {int(missing_score)}% complete, {int(uniqueness_score)}% unique, and contains {(outlier_count/total_cells*100):.1f}% outliers." if total_cells > 0 else ""
        }

    def discover_insights(self) -> List[Dict[str, Any]]:
        """Step 8: Insight Discovery Engine (Top/Bottom categories, Dominant Segments)"""
        insights = []
        
        cat_cols = [col for col in self.df.columns if self.df[col].nunique() < 20 and pd.api.types.is_string_dtype(self.df[col])]
        
        for col in cat_cols:
            val_counts = self.df[col].value_counts(normalize=True) * 100
            if val_counts.empty: continue
            
            top_cat = val_counts.index[0]
            top_pct = val_counts.iloc[0]
            
            bottom_cat = val_counts.index[-1]
            bottom_pct = val_counts.iloc[-1]
            
            insights.append({
                "type": "Dominant Segment",
                "feature": col,
                "finding": f"'{top_cat}' is the dominant segment, representing {top_pct:.1f}% of the data."
            })
            
            if len(val_counts) > 2:
                insights.append({
                    "type": "Underutilized Segment",
                    "feature": col,
                    "finding": f"'{bottom_cat}' is the smallest segment at only {bottom_pct:.1f}%."
                })
                
        # Numeric insights
        num_cols = self.df.select_dtypes(include=[np.number]).columns
        for col in num_cols:
            mean_val = self.df[col].mean()
            max_val = self.df[col].max()
            if max_val > mean_val * 5: # simple anomaly heuristic
                insights.append({
                    "type": "Anomaly Detected",
                    "feature": col,
                    "finding": f"Extreme values detected. Maximum is {max_val:.2f}, which is significantly higher than the average of {mean_val:.2f}."
                })
                
        return insights[:10] # limit to top 10

    def run(self) -> Dict[str, Any]:
        return {
            "domain_inference": self.infer_domain(),
            "data_quality_score": self.calculate_data_quality(),
            "discovered_insights": self.discover_insights()
        }
