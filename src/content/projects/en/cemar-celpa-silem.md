---
title: "SILEM — Image-Based Energy Metering"
partner: "CEMAR-CELPA / ANEEL P&D"
funding: "ANEEL P&D"
grantNumber: "[REQUIRED]"
status: "concluded"
startDate: "[REQUIRED]"
endDate: "[REQUIRED]"
description: "Mobile image acquisition and computational intelligence pipeline for reading and validating residential electricity meter digits. Uses FAST/GFTT feature detection for meter identification, CNN digit segmentation, and an automated audit trail."
researchArea: "computer-vision-medical-imaging"
members: ["[REQUIRED]"]
highlights:
  - "End-to-end OCR pipeline for analog and digital meters"
  - "FAST + GFTT + CNN multi-stage recognition"
  - "Integrated audit workflow reducing fraud"
tags: [computer-vision, ocr, mobile, energy]
featured: false
---
The SILEM system enables field operators to register electricity meter readings using only a smartphone camera, replacing manual transcription with an automated computer vision pipeline.

The recognition flow processes each captured frame through three parallel verification stages using FAST (Features from Accelerated Segment Test), GFTT (Good Features to Track), and a CNN classifier to confirm meter identity before extracting the display region. The display is then corrected for orientation, segmented into individual digit zones, and each digit is recognized independently. The system validates the reading against consumption history and flags anomalies for re-capture or manual review.

Readings are uploaded with GPS coordinates, timestamps, and the captured image as an audit record, significantly reducing the risk of fraudulent or estimated readings.
