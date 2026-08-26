# LP MarmoMonte

Estrutura:
  index.html
  assets/css/style.css
  assets/js/main.js
  assets/img/  (hero, proximidade, historia, obra-1..9 + versoes -full para o lightbox)

Deploy: arrastar a pasta no Vercel (estatico, sem build) ou `vercel --prod`.

## Antes de publicar
1. GTM-XXXXXXX -> ID real do container (2 ocorrencias no index.html)
2. ENDPOINT_FORM -> URL do Apps Script (topo do assets/js/main.js)
3. Baixar do site atual e salvar em assets/img, depois trocar os caminhos:
   - HORIZONTAL-FP-768x181.png -> logo.png (header e rodape)
   - cropped-favicon_marmomonte-270x270.png -> favicon.png
   - FOJ02E801, Granito-Preto-Sao-Gabriel, quartzito.png, translucido.png, laminas.png -> mat-*.jpg
4. Endereco completo e CEP de Capao da Canoa no JSON-LD
5. Bloco de prova social esta comentado, aguardando GMN corrigido e depoimentos

## Rodada de ajustes (Erick)
- Regioes: removidos Capao Novo, Arroio Teixeira e Atlantida (bairros de Capao da Canoa); incluidos Arroio do Sal e Osorio
- "dolomitos" -> "dolomiticos"
- Copy dos materiais: "arquiteto indicou ou detalhou um material especifico"
- Galeria: removidas as fotos 1, 3 e 12; 9 fotos restantes
