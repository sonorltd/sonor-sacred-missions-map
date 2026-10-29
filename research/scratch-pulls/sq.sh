#!/bin/bash
curl -sS -m 120 -A "SonorGeoResearch/1.0 (contact office@sonor.co.uk)" -G "https://query.wikidata.org/sparql" --data-urlencode "query=$1" -H "Accept: application/sparql-results+json"
