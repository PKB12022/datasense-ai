import pandas as pd
import numpy as np
from typing import Dict, Any, List

class InsightEngine:
    def __init__(self, df: pd.DataFrame, analysis_results: Dict[str, Any]):
        self.df = df
        self.df.columns = self.df.columns.str.lower()
        self.analysis_results = analysis_results

    def infer_domain(self) -> Dict[str, str]:
        cols = " ".join(self.df.columns).lower()
        domain_keywords = {
            "Housing Dataset": ['price', 'bedroom', 'bathroom', 'area', 'sqft', 'zipcode', 'property'],
            "Marketing Dataset": ['campaign', 'click', 'impression', 'conversion', 'ad', 'spend'],
            "Customer Dataset": ['customer', 'acquisition', 'channel', 'signup', 'churn', 'retention'],
            "Human Resources Dataset": ['salary', 'department', 'attrition', 'employee', 'hire', 'role'],
            "Financial Dataset": ['transaction', 'amount', 'merchant', 'credit', 'balance', 'account', 'fraud'],
            "Healthcare Dataset": ['diagnosis', 'symptom', 'patient', 'treatment', 'blood', 'heart'],
            "Transactional Sales Dataset": ['order', 'product', 'shipping', 'discount', 'cart', 'revenue', 'sales']
        }
        
        scores = {domain: 0 for domain in domain_keywords}
        for domain, keywords in domain_keywords.items():
            for kw in keywords:
                if kw in cols:
                    scores[domain] += 1
                    
        best_domain = max(scores, key=scores.get)
        best_score = scores[best_domain]
        
        if best_score == 0:
            return {"dataset_type": "General Dataset", "confidence": "Low (20%)", "reasoning": "No domain-specific keywords detected in column names."}
            
        confidence_pct = min(99, 50 + (best_score * 10))
        confidence = f"High ({confidence_pct}%)" if best_score > 2 else f"Medium ({confidence_pct}%)"
        return {
            "dataset_type": best_domain,
            "confidence": confidence,
            "reasoning": f"Detected {best_score} keywords strongly associated with a {best_domain}."
        }

    def calculate_data_quality(self) -> Dict[str, Any]:
        row_count = len(self.df)
        if row_count == 0: return {"Overall Data Health Score": "0/100"}
        
        profile = self.analysis_results.get("dataset_profile", {})
        total_cells = row_count * profile.get("column_count", 1)
        
        missing_count = sum(profile.get("missing_values", {}).values())
        missing_score = max(0, 100 - (missing_count / total_cells * 100)) if total_cells > 0 else 0
        
        duplicate_count = profile.get("duplicate_rows", 0)
        uniqueness_score = max(0, 100 - (duplicate_count / row_count * 100))
        
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
                
        num_cols = self.df.select_dtypes(include=[np.number]).columns
        for col in num_cols:
            mean_val = self.df[col].mean()
            max_val = self.df[col].max()
            if max_val > mean_val * 5 and mean_val > 0:
                insights.append({
                    "type": "Anomaly Detected",
                    "feature": col,
                    "finding": f"Extreme values detected. Maximum is {max_val:.2f}, which is significantly higher than the average of {mean_val:.2f}."
                })
                
        return insights[:10]

    def run(self) -> Dict[str, Any]:
        return {
            "dataset_type_detection": self.infer_domain(),
            "data_quality_score": self.calculate_data_quality(),
            "discovered_insights": self.discover_insights()
        }
