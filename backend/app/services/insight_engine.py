import pandas as pd
import numpy as np
from typing import Dict, Any, List

class InsightEngine:
    def __init__(self, df: pd.DataFrame, analysis_results: Dict[str, Any]):
        self.df = df
        self.analysis_results = analysis_results

    def generate_data_quality_score(self) -> Dict[str, Any]:
        row_count = len(self.df)
        if row_count == 0:
            return {"Overall Data Health Score": "0/100"}
        
        missing_count = self.df.isnull().sum().sum()
        total_cells = row_count * len(self.df.columns)
        completeness = max(0, 100 - (missing_count / total_cells * 100)) if total_cells > 0 else 0
        
        duplicate_count = self.df.duplicated().sum()
        uniqueness = max(0, 100 - (duplicate_count / row_count * 100)) if row_count > 0 else 0
        
        consistency = 100 # Default assumption
        validity = 100
        structure = 100 if len(self.df.columns) > 1 else 50
        
        overall = int(np.mean([completeness, uniqueness, consistency, validity, structure]))
        return {
            "Completeness Score": f"{int(completeness)}/100",
            "Consistency Score": f"{consistency}/100",
            "Uniqueness Score": f"{int(uniqueness)}/100",
            "Validity Score": f"{validity}/100",
            "Structure Score": f"{structure}/100",
            "Overall Data Health Score": f"{overall}/100",
            "Reasoning": f"Data is {int(completeness)}% complete and {int(uniqueness)}% unique."
        }

    def generate_ml_readiness_score(self) -> Dict[str, Any]:
        ml_rec = self.analysis_results.get("ml_recommendation", {})
        has_target = ml_rec.get("target_column") is not None
        
        feature_quality = 80 if len(self.df.columns) > 3 else 40
        target_quality = 90 if has_target else 20
        
        total_cells = len(self.df) * len(self.df.columns)
        missing_data_score = 100 - (self.df.isnull().sum().sum() / total_cells * 100) if total_cells > 0 else 0
        
        class_balance = 100
        if has_target and ml_rec.get("problem_type") == "Classification":
            target_col = ml_rec.get("target_column")
            if target_col in self.df.columns:
                val_counts = self.df[target_col].value_counts(normalize=True)
                if not val_counts.empty and val_counts.iloc[0] > 0.8:
                    class_balance = 40 # Highly imbalanced
        
        modeling_readiness = (feature_quality + target_quality) / 2
        overall = int(np.mean([feature_quality, target_quality, missing_data_score, class_balance, modeling_readiness]))
        
        return {
            "Feature Quality Score": f"{int(feature_quality)}/100",
            "Target Quality Score": f"{int(target_quality)}/100",
            "Missing Data Score": f"{int(missing_data_score)}/100",
            "Class Balance Score": f"{int(class_balance)}/100",
            "Modeling Readiness Score": f"{int(modeling_readiness)}/100",
            "Overall ML Readiness Score": f"{overall}/100",
            "Explanation": "Scored based on feature count, target identification, and missing value ratio."
        }

    def generate_column_intelligence(self) -> List[Dict[str, Any]]:
        intel = []
        for col in self.df.columns[:10]: # Limit to top 10 for brevity
            series = self.df[col]
            missing_pct = (series.isnull().sum() / len(series)) * 100 if len(series) > 0 else 0
            unique_count = series.nunique()
            dtype = str(series.dtype)
            
            ml_rel = "High" if pd.api.types.is_numeric_dtype(series) and unique_count > 1 else "Medium"
            if missing_pct > 50: ml_rel = "Low"
            
            intel.append({
                "column_name": col,
                "data_type": dtype,
                "missing_percent": f"{missing_pct:.1f}%",
                "uniqueness": unique_count,
                "business_relevance": "Strong" if unique_count < len(series) else "Identifier",
                "ml_relevance": ml_rel,
                "risk_level": "High" if missing_pct > 20 else "Low"
            })
        return intel

    def generate_root_cause_analysis(self) -> List[str]:
        causes = []
        for col in self.df.columns:
            missing_pct = (self.df[col].isnull().sum() / len(self.df)) * 100 if len(self.df) > 0 else 0
            if missing_pct > 20:
                causes.append(f"Missing values in '{col}' ({missing_pct:.1f}%) suggest incomplete data collection or optional fields.")
        if self.df.duplicated().sum() > 0:
            causes.append(f"Found {self.df.duplicated().sum()} duplicate records, suggesting repeated imports or faulty merges.")
        if not causes:
            causes.append("No major data anomalies detected.")
        return causes

    def generate_business_domain(self) -> Dict[str, str]:
        cols = " ".join(self.df.columns).lower()
        if any(w in cols for w in ['customer', 'churn', 'segment', 'age', 'gender']):
            domain = "Customer Analytics"
        elif any(w in cols for w in ['sales', 'revenue', 'price', 'discount', 'order']):
            domain = "Sales Analytics"
        elif any(w in cols for w in ['employee', 'hr', 'salary', 'department', 'attrition']):
            domain = "HR Analytics"
        elif any(w in cols for w in ['claim', 'policy', 'premium', 'insured']):
            domain = "Insurance Analytics"
        else:
            domain = "General Business Analytics"
            
        return {
            "domain": domain,
            "confidence": "Medium",
            "reasoning": "Based on column name keyword analysis."
        }

    def generate_business_kpis(self) -> List[str]:
        kpis = []
        cols = " ".join(self.df.columns).lower()
        if 'revenue' in cols or 'sales' in cols: kpis.append("Revenue")
        if 'churn' in cols: kpis.append("Churn Rate")
        if 'conversion' in cols: kpis.append("Conversion Rate")
        if 'customer' in cols: kpis.append("Customer Count")
        if not kpis:
            kpis = ["Row Count (Volume)"]
        return kpis

    def generate_top_findings(self) -> List[Dict[str, str]]:
        findings = []
        
        findings.append({
            "finding": f"Dataset contains {len(self.df)} records and {len(self.df.columns)} features.",
            "evidence": f"Row count is {len(self.df)}.",
            "business_impact": "Determines the statistical significance of subsequent findings.",
            "recommendation": "Ensure data volume represents the entire business cycle.",
            "confidence": "High"
        })
        
        missing = self.df.isnull().sum().sum()
        if missing > 0:
            findings.append({
                "finding": f"Dataset contains {missing} missing data points.",
                "evidence": f"Counted {missing} nulls across the dataframe.",
                "business_impact": "Missing data can skew averages and break ML models.",
                "recommendation": "Implement imputation strategies or drop heavily sparse columns.",
                "confidence": "High"
            })
            
        ml_rec = self.analysis_results.get("ml_recommendation", {})
        if ml_rec.get("target_column"):
            target = ml_rec["target_column"]
            findings.append({
                "finding": f"Identified '{target}' as the primary prediction target.",
                "evidence": f"Column heuristics suggest '{target}' is the target.",
                "business_impact": f"Allows for {ml_rec.get('problem_type')} modeling to predict outcomes.",
                "recommendation": f"Focus feature engineering efforts around optimizing '{target}'.",
                "confidence": "Medium"
            })
            
        return findings

    def generate_confidence_assessment(self) -> Dict[str, str]:
        total_cells = len(self.df) * len(self.df.columns)
        return {
            "data_quality_confidence": "High" if self.df.isnull().sum().sum() < (total_cells * 0.1) else "Medium",
            "analysis_confidence": "High",
            "modeling_confidence": "Medium",
            "business_confidence": "Medium"
        }

    def run(self) -> Dict[str, Any]:
        return {
            "top_findings": self.generate_top_findings(),
            "data_quality_score": self.generate_data_quality_score(),
            "ml_readiness_score": self.generate_ml_readiness_score(),
            "business_kpis": self.generate_business_kpis(),
            "root_cause_analysis": self.generate_root_cause_analysis(),
            "column_intelligence": self.generate_column_intelligence(),
            "business_domain": self.generate_business_domain(),
            "confidence_assessment": self.generate_confidence_assessment()
        }
