# Protótipo Website Clínica Dentária

Protótipo de website de página única para uma clínica dentária fictícia — **ALMA — Clínica Dentária**.
HTML, CSS e JavaScript simples, sem framework, sem build.

## Referencias

- https://www.premierartsdental.com/
- https://www.prismoralsurgery.com/
- https://www.vividdental.ca/
- https://www.markmurphydds.com/

## Requisitos

- palete de cores consistente
- ar familiar
- aspecto profissional
- listagem de serviços fácil de perceber
- navegação intuitiva
- visualmente apelativo: factor uau

## Como correr

Não há build, nem gestor de pacotes, nem testes. Basta:

- abrir `index.html` diretamente no browser, **ou**
- servir a pasta com qualquer servidor estático (`npx serve .`)

As duas formas são equivalentes. Para editar: alterar o ficheiro e recarregar a página.

## Estrutura

```
index.html      página completa (inclui o sprite SVG dos ícones)
css/style.css   folha de estilos única; tokens de design em :root
js/main.js      interações, num único IIFE com blocos independentes
```

Secções, por ordem: header · hero · faixa de confiança · sobre · o dentista ·
serviços · diferenciais · antes & depois · testemunhos · faixa CTA · contacto · rodapé.

## Estado atual

Implementado e verificado em Chromium (1440 / 1200 / 390 px e com `prefers-reduced-motion`):

- navegação completa em desktop, menu hambúrguer apenas abaixo de 1080 px, com indicador
  de secção ativa (scrollspy)
- comparador "antes & depois" com rato e teclado
- carrossel de testemunhos com setas, teclado, pausa e paragem ao receber foco
- formulário com validação inline, consentimento RGPD e honeypot anti-spam
  (**front-end apenas — não envia nada**)
- ícones em sprite SVG inline; sem Font Awesome (menos ~366 KB de CSS e webfonts)
- mapa real do Google Maps, carregado em lazy
- respeita `prefers-reduced-motion` em toda a página

## Antes de ir para produção

O conteúdo é todo ilustrativo. Substituir obrigatoriamente:

- [ ] **Fotografia real** da clínica, do consultório e da equipa — todas as imagens são
      placeholders do Unsplash em hotlink
- [ ] **Antes & Depois**: caso clínico real do mesmo paciente, com consentimento informado
      escrito. As imagens atuais são de banco de imagens e estão assinaladas como tal na página
- [ ] **Dados da clínica**: morada, coordenadas geográficas, telefone, email e URL canónico
      (no `<head>` e no JSON-LD)
- [ ] **Números e testemunhos**: estatísticas do hero e citações são fictícias.
      O `aggregateRating` foi deliberadamente omitido do JSON-LD — só deve ser publicado
      com avaliações reais e verificáveis
- [ ] **Certificações** do marquee (Invisalign Diamond, ISO 9001, Straumann) — confirmar
      que correspondem à realidade
- [ ] **Páginas legais**: Política de Privacidade e Termos (hoje `href="#"`), NIF e número
      de registo na ERS no rodapé
- [ ] **Redes sociais**: links do rodapé apontam para `href="#"`
- [ ] **Backend do formulário**: endpoint de envio, armazenamento dos dados conforme o RGPD
      e resposta ao utilizador

Os pontos que exigem alteração no código estão marcados com `TODO (pré-produção)` no `index.html`.
