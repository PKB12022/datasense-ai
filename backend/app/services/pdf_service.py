import io
import json
import datetime
import re
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from typing import Dict, Any

class PDFService:
    @staticmethod
    def generate_report(analysis_results: Dict[str, Any], filename: str) -> bytes:
        """
        Generates a visually rich PDF dashboard using ReportLab.
        """
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=50, leftMargin=50, topMargin=50, bottomMargin=50)
        
        styles = getSampleStyleSheet()
        title_style = styles['Heading1']
        title_style.fontSize = 24
        title_style.textColor = colors.HexColor("#1e3a8a")
        
        h2_style = styles['Heading2']
        h2_style.fontSize = 16
        h2_style.textColor = colors.HexColor("#1e40af")
        h2_style.spaceBefore = 20
        h2_style.spaceAfter = 10
        
        body_style = styles['Normal']
        body_style.fontSize = 11
        body_style.leading = 14
        
        insight_style = ParagraphStyle(
            'Insight',
            parent=body_style,
            leftIndent=15,
            bulletIndent=5,
            spaceAfter=8
        )

        Story = []
        
        # --- PAGE 1: EXECUTIVE DASHBOARD ---
        Story.append(Paragraph("<b>DataSense AI</b> | Premium Analytics", title_style))
        Story.append(Spacer(1, 10))
        Story.append(Paragraph(f"<b>Dataset:</b> {filename}", body_style))
        Story.append(Paragraph(f"<b>Generated:</b> {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}", body_style))
        Story.append(Spacer(1, 20))
        
        engine = analysis_results.get('engine_insights', {})
        stats = analysis_results.get('basic_stats', {})
        ml = analysis_results.get('ml_recommendation', {})
        dq = engine.get('data_quality_score', {})
        ml_score = engine.get('ml_readiness_score', {})
        
        # KPI Cards (Table)
        kpi_data = [
            ["Rows", "Columns", "Data Quality", "ML Readiness"],
            [str(stats.get("row_count", 0)), str(stats.get("column_count", 0)), 
             dq.get("Overall Data Health Score", "N/A"), ml_score.get("Overall ML Readiness Score", "N/A")]
        ]
        
        kpi_table = Table(kpi_data, colWidths=[120, 120, 120, 120])
        kpi_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f3f4f6")),
            ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor("#4b5563")),
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('FONTSIZE', (0,0), (-1,0), 10),
            ('BOTTOMPADDING', (0,0), (-1,0), 8),
            ('BACKGROUND', (0,1), (-1,1), colors.white),
            ('TEXTCOLOR', (0,1), (-1,1), colors.HexColor("#111827")),
            ('FONTNAME', (0,1), (-1,1), 'Helvetica-Bold'),
            ('FONTSIZE', (0,1), (-1,1), 16),
            ('TOPPADDING', (0,1), (-1,1), 10),
            ('BOTTOMPADDING', (0,1), (-1,1), 10),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#e5e7eb")),
            ('INNERGRID', (0,0), (-1,-1), 1, colors.HexColor("#e5e7eb")),
        ]))
        
        Story.append(kpi_table)
        Story.append(Spacer(1, 20))
        
        # ML Problem Card
        ml_data = [
            ["Problem Type", "Target Variable"],
            [ml.get("problem_type", "Unknown"), ml.get("target_column", "None Detected")]
        ]
        ml_table = Table(ml_data, colWidths=[240, 240])
        ml_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#eff6ff")),
            ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor("#1e40af")),
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('FONTSIZE', (0,0), (-1,1), 12),
            ('BOTTOMPADDING', (0,0), (-1,-1), 8),
            ('TOPPADDING', (0,0), (-1,-1), 8),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#bfdbfe")),
            ('INNERGRID', (0,0), (-1,-1), 1, colors.HexColor("#bfdbfe")),
        ]))
        Story.append(ml_table)
        Story.append(Spacer(1, 30))
        
        # Visual Analytics
        visuals = analysis_results.get('visuals', {})
        if visuals:
            Story.append(Paragraph("Visual Analytics", h2_style))
            
            # Feature Importance
            if 'feature_importance' in visuals:
                img_stream = io.BytesIO(visuals['feature_importance'])
                img = Image(img_stream, width=450, height=225)
                Story.append(img)
                Story.append(Spacer(1, 15))
                
            # Correlation Heatmap
            if 'correlation_heatmap' in visuals:
                img_stream = io.BytesIO(visuals['correlation_heatmap'])
                img = Image(img_stream, width=400, height=250)
                Story.append(img)
                Story.append(Spacer(1, 15))
                
            Story.append(PageBreak())
            Story.append(Paragraph("Data Distributions & Anomalies", h2_style))
            
            # Distributions & Outliers
            if 'target_distribution' in visuals:
                img_stream = io.BytesIO(visuals['target_distribution'])
                img = Image(img_stream, width=400, height=150)
                Story.append(img)
                Story.append(Spacer(1, 15))
                
            if 'outlier_boxplots' in visuals:
                img_stream = io.BytesIO(visuals['outlier_boxplots'])
                img = Image(img_stream, width=450, height=170)
                Story.append(img)
                Story.append(Spacer(1, 15))
                
            if 'missing_values_chart' in visuals:
                img_stream = io.BytesIO(visuals['missing_values_chart'])
                img = Image(img_stream, width=400, height=150)
                Story.append(img)
                
            Story.append(PageBreak())
            
        # Data Quality Dashboard
        Story.append(Paragraph("Data Quality Dashboard", h2_style))
        dq_dash = [
            ["Metric", "Value", "Metric", "Value"],
            ["Completeness", dq.get("Completeness Score", "N/A"), "Consistency", dq.get("Consistency Score", "N/A")],
            ["Uniqueness", dq.get("Uniqueness Score", "N/A"), "Validity", dq.get("Validity Score", "N/A")]
        ]
        dq_table = Table(dq_dash, colWidths=[120, 120, 120, 120])
        dq_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f3f4f6")),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#e5e7eb")),
            ('INNERGRID', (0,0), (-1,-1), 1, colors.HexColor("#e5e7eb")),
            ('BOTTOMPADDING', (0,0), (-1,-1), 8),
            ('TOPPADDING', (0,0), (-1,-1), 8),
        ]))
        Story.append(dq_table)
        Story.append(Spacer(1, 20))
            
        # AI Insights
        ai_insights = analysis_results.get('ai_insights', '')
        if ai_insights:
            for line in ai_insights.split('\n'):
                line = line.strip()
                if not line:
                    Story.append(Spacer(1, 4))
                    continue
                
                line = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', line)
                
                if line.startswith('# '):
                    Story.append(Spacer(1, 15))
                    Story.append(Paragraph(line[2:], h2_style))
                    Story.append(Spacer(1, 5))
                elif line.startswith('## '):
                    Story.append(Spacer(1, 10))
                    Story.append(Paragraph(f"<b>{line[3:]}</b>", body_style))
                    Story.append(Spacer(1, 4))
                elif line.startswith('* ') or line.startswith('- '):
                    Story.append(Paragraph(line, insight_style))
                else:
                    Story.append(Paragraph(line, body_style))
        
        doc.build(Story)
        pdf_bytes = buffer.getvalue()
        buffer.close()
        return pdf_bytes
