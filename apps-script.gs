/**
 * LP MarmoMonte — recebe os leads do formulário e grava na planilha.
 *
 * Como usar:
 * 1. Crie uma planilha no Google Sheets (ex.: "Leads LP MarmoMonte").
 * 2. Extensões > Apps Script, apague tudo e cole este arquivo.
 * 3. Implantar > Nova implantação > tipo "App da Web".
 *    Executar como: Eu
 *    Quem pode acessar: Qualquer pessoa
 * 4. Copie a URL gerada (termina em /exec) e cole em ENDPOINT_FORM no assets/js/main.js.
 */

var CABECALHO = ['Data', 'Nome', 'WhatsApp', 'Cidade', 'Perfil', 'Ambiente', 'Material', 'Detalhes', 'Origem', 'URL'];

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    var aba = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    if (aba.getLastRow() === 0) {
      aba.appendRow(CABECALHO);
      aba.getRange(1, 1, 1, CABECALHO.length).setFontWeight('bold');
    }

    aba.appendRow([
      d.data || new Date().toLocaleString('pt-BR'),
      d.nome || '',
      d.telefone || '',
      d.cidade || '',
      d.perfil || '',
      d.ambiente || '',
      d.material || '',
      d.mensagem || '',
      d.origem || 'LP MarmoMonte',
      d.url || ''
    ]);

    return ContentService.createTextOutput(JSON.stringify({ok: true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ok: false, erro: String(err)}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput('Endpoint ativo.');
}
