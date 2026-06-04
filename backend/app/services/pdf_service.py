import io
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
        Story.append(Paragraph("<b>DataSense AI</b> | Universal Dataset Intelligence", title_style))
        Story.append(Spacer(1, 10))
        Story.append(Paragraph(f"<b>Dataset:</b> {filename}", body_style))
        Story.append(Paragraph(f"<b>Generated:</b> {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}", body_style))
        Story.append(Spacer(1, 20))
        
        engine = analysis_results.get('engine_insights', {})
        profile = analysis_results.get('dataset_profile', {})
        target_info = analysis_results.get('target_detection', {})
        mode_info = analysis_results.get('analysis_mode', {})
        dq = engine.get('data_quality_score', {})
        domain = engine.get('domain_inference', {})
        
        # 1. Dataset Summary & Domain Detection
        summary_data = [
            ["Rows", "Columns", "Inferred Domain", "Domain Confidence"],
            [str(profile.get("row_count", 0)), str(profile.get("column_count", 0)), 
             domain.get("domain", "Unknown"), domain.get("confidence", "N/A")]
        ]
        
        sum_table = Table(summary_data, colWidths=[120, 120, 120, 120])
        sum_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f3f4f6")),
            ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor("#4b5563")),
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('FONTSIZE', (0,0), (-1,0), 10),
            ('BOTTOMPADDING', (0,0), (-1,0), 8),
            ('BACKGROUND', (0,1), (-1,1), colors.white),
            ('TEXTCOLOR', (0,1), (-1,1), colors.HexColor("#111827")),
            ('FONTNAME', (0,1), (-1,1), 'Helvetica-Bold'),
            ('FONTSIZE', (0,1), (-1,1), 14),
            ('TOPPADDING', (0,1), (-1,1), 10),
            ('BOTTOMPADDING', (0,1), (-1,1), 10),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#e5e7eb")),
            ('INNERGRID', (0,0), (-1,-1), 1, colors.HexColor("#e5e7eb")),
        ]))
        Story.append(sum_table)
        Story.append(Spacer(1, 10))
        Story.append(Paragraph(f"<i>Domain Reasoning: {domain.get('reasoning', '')}</i>", body_style))
        Story.append(Spacer(1, 20))

        # 2. Analysis Mode & Target
        mode_data = [
            ["Analysis Mode", "Mode Confidence", "Target Variable", "Target Confidence"],
            [mode_info.get("mode", "Unknown"), mode_info.get("confidence", "N/A"),
             target_info.get("target_column", "None"), target_info.get("confidence", "N/A")]
        ]
        mode_table = Table(mode_data, colWidths=[120, 120, 120, 120])
        mode_table.setStyle(TableStyle([
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
        Story.append(mode_table)
        Story.append(Spacer(1, 10))
        Story.append(Paragraph(f"<i>Mode Reasoning: {mode_info.get('reasoning', '')}</i>", body_style))
        Story.append(Spacer(1, 4))
        Story.append(Paragraph(f"<i>Target Reasoning: {target_info.get('reasoning', '')}</i>", body_style))
        Story.append(Spacer(1, 20))
        
        # 3. Data Health Overview
        Story.append(Paragraph("Data Health Overview", h2_style))
        Story.append(Paragraph(f"<b>Overall Score:</b> {dq.get('Overall Data Health Score', 'N/A')}", body_style))
        Story.append(Spacer(1, 5))
        Story.append(Paragraph(dq.get('Explanation', ''), body_style))

        Story.append(PageBreak())
        
        # --- PAGE 2: VISUAL ANALYTICS ---
        Story.append(Paragraph("Page 2: Visual Analytics", title_style))
        visuals = analysis_results.get('visuals', {})
        if visuals:
            # Render numerical dists
            if 'num_dist_0' in visuals:
                Story.append(Image(io.BytesIO(visuals['num_dist_0']), width=400, height=150))
                Story.append(Spacer(1, 10))
            if 'num_dist_1' in visuals:
                Story.append(Image(io.BytesIO(visuals['num_dist_1']), width=400, height=150))
                Story.append(Spacer(1, 10))
            # Render categorical dists
            if 'cat_dist_0' in visuals:
                Story.append(Image(io.BytesIO(visuals['cat_dist_0']), width=400, height=150))
                Story.append(Spacer(1, 10))
            if 'cat_dist_1' in visuals:
                Story.append(Image(io.BytesIO(visuals['cat_dist_1']), width=400, height=150))
                Story.append(Spacer(1, 10))
            # Heatmap
            if 'correlation_heatmap' in visuals:
                Story.append(Image(io.BytesIO(visuals['correlation_heatmap']), width=400, height=250))
                Story.append(Spacer(1, 10))
            # Outliers
            if 'outlier_boxplots' in visuals:
                Story.append(Image(io.BytesIO(visuals['outlier_boxplots']), width=450, height=170))
                Story.append(Spacer(1, 10))
            # Missing
            if 'missing_values_chart' in visuals:
                Story.append(Image(io.BytesIO(visuals['missing_values_chart']), width=400, height=150))

        Story.append(PageBreak())
            
        # --- PAGES 3, 4, 5, 6: AI NARRATIVES ---
        ai_insights = analysis_results.get('ai_insights', '')
        if ai_insights:
            for line in ai_insights.split('\n'):
                line = line.strip()
                if not line:
                    Story.append(Spacer(1, 4))
                    continue
                
                # Dynamic page breaks
                if line.startswith('# Page 4') or line.startswith('# Page 5') or line.startswith('# Page 6'):
                    Story.append(PageBreak())
                    Story.append(Paragraph(line[2:], title_style))
                    Story.append(Spacer(1, 15))
                    continue
                elif line.startswith('# Page 3'):
                    Story.append(Paragraph(line[2:], title_style))
                    Story.append(Spacer(1, 15))
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
