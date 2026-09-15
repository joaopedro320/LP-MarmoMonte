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

## Formulário: planilha + redirecionamento para o WhatsApp

Ao enviar, o formulário grava o lead na planilha do Google e abre o WhatsApp da MarmoMonte com a mensagem já preenchida (mesmo padrão da LP da C&K Mármores).

Para ativar:

1. Abra `apps-script.gs`, siga o passo a passo do topo do arquivo e publique o App da Web.
2. Copie a URL que termina em `/exec`.
3. Em `assets/js/main.js`, cole a URL em `ENDPOINT_FORM` (linha 2).
4. O número de destino fica em `WHATSAPP`, logo abaixo (só números, com DDI: `5551990199620`).

Enquanto `ENDPOINT_FORM` estiver com o placeholder, o formulário continua funcionando e abre o WhatsApp normalmente, só não grava na planilha.

A gravação usa `navigator.sendBeacon`, que continua rodando mesmo com o navegador saindo para o WhatsApp. O evento `gerar_lead` continua sendo enviado ao dataLayer antes do redirecionamento.
