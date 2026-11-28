---
title: "SILEM — Medição de Energia Baseada em Imagem"
partner: "CEMAR-CELPA / ANEEL P&D"
funding: "ANEEL P&D"
grantNumber: "[REQUIRED]"
status: "concluded"
startDate: "[REQUIRED]"
endDate: "[REQUIRED]"
description: "Pipeline móvel de aquisição de imagens e inteligência computacional para leitura e validação de dígitos de medidores residenciais de energia elétrica. Utiliza detecção de características FAST/GFTT para identificação do medidor, segmentação de dígitos com CNN e trilha de auditoria automatizada."
researchArea: "computer-vision-medical-imaging"
members: ["[REQUIRED]"]
highlights:
  - "Pipeline OCR de ponta a ponta para medidores analógicos e digitais"
  - "Reconhecimento em múltiplos estágios FAST + GFTT + CNN"
  - "Fluxo de auditoria integrado que reduz fraudes"
tags: [computer-vision, ocr, mobile, energy]
featured: false
lang: "pt"
---
O sistema SILEM permite que operadores de campo registrem leituras de medidores de energia usando apenas a câmera de um smartphone, substituindo a transcrição manual por um pipeline automatizado de visão computacional.

O fluxo de reconhecimento processa cada quadro capturado em três estágios paralelos de verificação, utilizando FAST (Features from Accelerated Segment Test), GFTT (Good Features to Track) e um classificador CNN para confirmar a identidade do medidor antes de extrair a região do visor. O visor é corrigido quanto à orientação, segmentado em zonas individuais de dígitos e cada dígito é reconhecido de forma independente. O sistema valida a leitura em relação ao histórico de consumo e sinaliza anomalias para nova captura ou revisão manual.

As leituras são enviadas com coordenadas GPS, carimbos de data e hora e a imagem capturada como registro de auditoria, reduzindo significativamente o risco de leituras fraudulentas ou estimadas.