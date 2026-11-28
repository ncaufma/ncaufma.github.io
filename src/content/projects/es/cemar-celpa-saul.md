---
title: "SAUL — Gestión de equipos de lectura"
partner: "CEMAR-CELPA / ANEEL P&D"
funding: "ANEEL P&D"
grantNumber: "[REQUIRED]"
status: "concluded"
startDate: "[REQUIRED]"
endDate: "[REQUIRED]"
description: "Sistema de gestión logística geoespacial para equipos de lectura residencial de medidores de energía eléctrica. Utiliza inteligencia computacional y SIG para agrupar unidades de servicio en rutas de lectura optimizadas, minimizando el tiempo de desplazamiento y el costo operativo."
researchArea: "logistics-optimization"
members: ["[REQUIRED]"]
highlights:
  - "Agrupamiento espacial basado en SIG de miles de unidades de servicio"
  - "Generación de rutas de lectura optimizadas"
  - "Integración con el sistema móvil de lectura SILEM"
tags: [gis, logistics, optimization, energy]
featured: false
lang: "es"
---
SAUL aborda el desafío operativo de planificar rutas diarias para decenas de equipos de lectura distribuidos en amplias zonas de servicio urbanas y periurbanas.

El sistema importa el registro completo de unidades residenciales, geocodifica cada dirección y aplica algoritmos de agrupamiento espacial para reunir unidades cercanas en lotes diarios de lectura. Una capa de optimización de rutas secuencia cada agrupamiento para minimizar la distancia total recorrida, teniendo en cuenta las restricciones de la red vial importadas de OpenStreetMap.

Las asignaciones de equipo se generan automáticamente y se envían a los supervisores de campo mediante un panel web. El seguimiento en tiempo real y los informes de finalización permiten reasignar rutas no completadas de forma dinámica durante la jornada laboral.