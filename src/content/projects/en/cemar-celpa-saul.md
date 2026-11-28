---
title: "SAUL — Meter Reading Team Management"
partner: "CEMAR-CELPA / ANEEL P&D"
funding: "ANEEL P&D"
grantNumber: "[REQUIRED]"
status: "concluded"
startDate: "[REQUIRED]"
endDate: "[REQUIRED]"
description: "Geospatial logistics management system for residential electricity meter-reading teams. Uses computational intelligence and GIS to cluster service units into optimized reading routes, minimizing travel time and operational cost."
researchArea: "logistics-optimization"
members: ["[REQUIRED]"]
highlights:
  - "GIS-based spatial clustering of thousands of service units"
  - "Optimized reading route generation"
  - "Integration with SILEM mobile reading system"
tags: [gis, logistics, optimization, energy]
featured: false
---
SAUL addresses the operational challenge of planning daily routes for dozens of meter-reading teams distributed across large urban and peri-urban service areas.

The system imports the complete registry of residential service units, geocodes each address, and applies spatial clustering algorithms to group nearby units into daily reading batches. A route optimization layer then sequences each cluster to minimize total travel distance, accounting for road network constraints imported from OpenStreetMap.

Team assignments are generated automatically and pushed to field supervisors through a web dashboard. Real-time tracking and completion reporting allow supervisors to reassign uncompleted routes dynamically during the working day.
