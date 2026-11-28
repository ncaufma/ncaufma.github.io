---
title: "SILEM — Medición de energía basada en imagen"
partner: "CEMAR-CELPA / ANEEL P&D"
funding: "ANEEL P&D"
grantNumber: "[REQUIRED]"
status: "concluded"
startDate: "[REQUIRED]"
endDate: "[REQUIRED]"
description: "Canal móvil de adquisición de imágenes e inteligencia computacional para lectura y validación de dígitos de medidores residenciales de energía eléctrica. Utiliza detección de características FAST/GFTT para identificación del medidor, segmentación de dígitos con CNN y trazabilidad de auditoría automatizada."
researchArea: "computer-vision-medical-imaging"
members: ["[REQUIRED]"]
highlights:
  - "Canal OCR de extremo a extremo para medidores analógicos y digitales"
  - "Reconocimiento multietapa FAST + GFTT + CNN"
  - "Flujo de auditoría integrado que reduce el fraude"
tags: [computer-vision, ocr, mobile, energy]
featured: false
lang: "es"
---
El sistema SILEM permite que los operadores de campo registren lecturas de medidores de energía usando únicamente la cámara de un teléfono inteligente, sustituyendo la transcripción manual por un canal automatizado de visión por computador.

El flujo de reconocimiento procesa cada fotograma capturado en tres etapas paralelas de verificación mediante FAST (Features from Accelerated Segment Test), GFTT (Good Features to Track) y un clasificador CNN para confirmar la identidad del medidor antes de extraer la región del display. El display se corrige en orientación, se segmenta en zonas individuales de dígitos y cada dígito se reconoce de forma independiente. El sistema valida la lectura frente al historial de consumo y marca anomalías para una nueva captura o revisión manual.

Las lecturas se cargan con coordenadas GPS, marcas de tiempo y la imagen capturada como registro de auditoría, reduciendo significativamente el riesgo de lecturas fraudulentas o estimadas.