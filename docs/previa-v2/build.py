#!/usr/bin/env python3
"""Monta a prévia v2 em dois formatos a partir das mesmas partes:
   - local/*.html  : cópias para conferir no navegador (fontes locais, sem a sintaxe do canvas)
   - project/*.dc.html + project/canvas.json : os artboards do canvas de design

Uso: build.py local | build.py canvas assets.json heights.json
"""
import json, os, re, sys, html

RAIZ = os.path.dirname(os.path.abspath(__file__))
PARTS = os.path.join(RAIZ, 'parts')

def ler(nome):
    with open(os.path.join(PARTS, nome), encoding='utf-8') as f:
        return f.read()

CSS = ler('site.css')
HEADER = ler('header.html')
FOOTER = ler('footer.html')

# (stem do arquivo do canvas, título, parte, usa busca)
PAGINAS = [
    ('Main', 'Início', 'inicio.html', True),
    ('Area', 'Área · Pensão alimentícia', 'area.html', False),
    ('Escritorio', 'O escritório', 'escritorio.html', False),
    ('Situacao', 'Situação · Ele parou de pagar a pensão', 'situacao.html', False),
    ('Resposta', 'Resposta · Ele pode ser preso se não pagar a pensão?', 'resposta.html', False),
]
STEM_LOCAL = {'Main': 'inicio', 'Area': 'area', 'Escritorio': 'escritorio', 'Situacao': 'situacao', 'Resposta': 'resposta'}

FONTS_LINK = ("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600"
              "&amp;family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&amp;display=swap")

ROOT_OPEN = ('<div class="site" style="background: #f7f4ee; color: #141d2e; '
             "font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif\">")
ROOT_CLOSE = '</div>'

LINKS_JS = """
    var cel = !!this.props.celular;
    var L = cel ? {
      inicio: 'Inicio-celular.dc.html', area: 'Area-celular.dc.html', escritorio: 'Escritorio-celular.dc.html',
      situacao: 'Situacao-celular.dc.html', resposta: 'Resposta-celular.dc.html'
    } : {
      inicio: 'Main.dc.html', area: 'Area.dc.html', escritorio: 'Escritorio.dc.html',
      situacao: 'Situacao.dc.html', resposta: 'Resposta.dc.html'
    };
"""

SCRIPT_SIMPLES = """<script type="text/x-dc" data-dc-script data-props='{"celular":{"editor":null,"default":false,"tsType":"boolean"},"$preview":{"width":%(w)d,"height":%(h)d}}'>
class Component extends DCLogic {
  renderVals() {%(links)s
    return { L: L };
  }
}
</script>"""

SCRIPT_BUSCA = """<script type="text/x-dc" data-dc-script data-props='{"celular":{"editor":null,"default":false,"tsType":"boolean"},"$preview":{"width":%(w)d,"height":%(h)d}}'>
class Component extends DCLogic {
  renderVals() {
    var s = this.state || {};
    var self = this;%(links)s
    var base = [
      { pergunta: 'Ele pode ser preso se não pagar a pensão?', situacao: 'Ele parou de pagar a pensão', pronta: true },
      { pergunta: 'Posso cobrar os meses atrasados?', situacao: 'Ele parou de pagar a pensão' },
      { pergunta: 'E se ele não tiver carteira assinada?', situacao: 'Ele parou de pagar a pensão' },
      { pergunta: 'Pagar só uma parte evita a prisão?', situacao: 'Ele parou de pagar a pensão' },
      { pergunta: 'O desemprego dele acaba com a pensão?', situacao: 'Ele quer diminuir a pensão' },
      { pergunta: 'A partir de quando a pensão vale?', situacao: 'Nunca pedi pensão e quero pedir' },
      { pergunta: 'Preciso saber quanto ele ganha para pedir pensão?', situacao: 'Nunca pedi pensão e quero pedir' },
      { pergunta: 'Plano de saúde e escola entram na pensão?', situacao: 'A pensão não cobre os gastos' },
      { pergunta: 'Preciso que ele concorde para me separar?', situacao: 'Quero me separar' },
      { pergunta: 'Guarda compartilhada significa metade do tempo?', situacao: 'Ele ameaça tirar a guarda de mim' },
      { pergunta: 'Existe pensão durante a gravidez?', situacao: 'Estou grávida e ele sumiu' },
      { pergunta: 'Preciso da autorização dele para mudar de cidade com meu filho?', situacao: 'Quero me mudar de cidade com meu filho' },
      { pergunta: 'Tenho direito a alguma coisa se vivemos juntos sem casar?', situacao: 'Vivemos juntos sem casar' },
      { pergunta: 'Como pedir medida protetiva?', situacao: 'Tenho medo dele' }
    ];
    function norm(x) { return String(x || '').normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').toLowerCase(); }
    var q = typeof s.q === 'string' ? s.q : '';
    var termos = norm(q).split(/\\s+/).filter(function (w) { return w.length > 0; });
    var achados = termos.length === 0 ? [] : base.filter(function (it) {
      var alvo = norm(it.pergunta + ' ' + it.situacao);
      return termos.every(function (w) { return alvo.indexOf(w) !== -1; });
    });
    var resultados = achados.map(function (it) {
      return { pergunta: it.pergunta, situacao: it.situacao, href: it.pronta ? L.resposta : L.situacao };
    });
    return {
      L: L,
      q: q,
      temBusca: termos.length > 0,
      resultados: resultados,
      temResultados: resultados.length > 0,
      semResultado: termos.length > 0 && resultados.length === 0,
      limparBusca: function () { self.setState({ q: '' }); },
      mudarBusca: function (e) { self.setState({ q: e && e.target ? e.target.value : '' }); }
    };
  }
}
</script>"""

CELULAR = """<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>%(titulo)s no celular</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="stylesheet" href="%(fonts)s">
<style>
body{margin:0}
</style>
</helmet>
<div style="width: 390px; height: %(h)dpx; overflow: hidden; background: #f7f4ee">
<dc-import name="%(stem)s" celular="{{celular}}" hint-size="390px,%(h)dpx"></dc-import>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":390,"height":%(h)d}}'>
class Component extends DCLogic {
  renderVals() {
    return { celular: true };
  }
}
</script>
</body>
</html>
"""

def corpo(parte, assets):
    s = HEADER + '\n' + ler(parte) + '\n' + FOOTER
    for k, v in assets.items():
        s = s.replace('%%' + k + '%%', v)
    resto = re.findall(r'%%[A-Z_]+%%', s)
    if resto:
        raise SystemExit('token de asset sem valor: ' + ', '.join(sorted(set(resto))))
    return s

def dc(stem, titulo, parte, busca, assets, w, h):
    partes = [
        '<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n<title>%s</title>\n<script src="./support.js"></script>\n</head>\n<body>\n<x-dc>\n<helmet>\n' % html.escape(titulo),
        '<link rel="stylesheet" href="%s">\n<style>\nbody{margin:0}\n%s\n</style>\n</helmet>\n' % (FONTS_LINK, CSS),
        ROOT_OPEN + '\n' + corpo(parte, assets) + '\n' + ROOT_CLOSE + '\n</x-dc>\n',
        (SCRIPT_BUSCA if busca else SCRIPT_SIMPLES) % {'w': w, 'h': h, 'links': LINKS_JS},
        '\n</body>\n</html>\n',
    ]
    return ''.join(partes)

# ---- versão local (sem a sintaxe do canvas) ----
def local_html(stem, titulo, parte, assets):
    s = corpo(parte, assets)
    links = {k: STEM_LOCAL[v] + '.html' for k, v in
             {'inicio': 'Main', 'area': 'Area', 'escritorio': 'Escritorio', 'situacao': 'Situacao', 'resposta': 'Resposta'}.items()}
    for k, v in links.items():
        s = s.replace('{{L.%s}}' % k, v)
    # handlers e valores de estado
    s = re.sub(r'\s(onClick|onChange|onInput)="\{\{[^}]+\}\}"', '', s)
    s = s.replace('value="{{q}}"', 'value=""')
    # sc-if: mantém o ramo conforme o hint
    def sc_if(m):
        return m.group(2) if 'hint-placeholder-val="{{true}}"' in m.group(1) else ''
    s = re.sub(r'<sc-if\b([^>]*)>(.*?)</sc-if>', sc_if, s, flags=re.S)
    def sc_for(m):
        inner = m.group(2)
        out = []
        for i in range(3):
            t = re.sub(r'\{\{r\.pergunta\}\}', 'Pergunta de exemplo %d?' % (i + 1), inner)
            t = re.sub(r'\{\{r\.situacao\}\}', 'Situação de exemplo', t)
            t = re.sub(r'\{\{r\.href\}\}', '#', t)
            out.append(t)
        return ''.join(out)
    s = re.sub(r'<sc-for\b([^>]*)>(.*?)</sc-for>', sc_for, s, flags=re.S)
    sobras = re.findall(r'\{\{[^}]+\}\}', s)
    if sobras:
        raise SystemExit('hole sem valor na versão local: ' + ', '.join(sorted(set(sobras))))
    fontes = """
@font-face{font-family:'Playfair Display';font-style:normal;font-weight:400 900;font-display:block;src:url(../fonts/playfair-display-latin-wght-normal.woff2) format('woff2')}
@font-face{font-family:'Playfair Display';font-style:italic;font-weight:400 900;font-display:block;src:url(../fonts/playfair-display-latin-wght-italic.woff2) format('woff2')}
@font-face{font-family:'Inter';font-style:normal;font-weight:100 900;font-display:block;src:url(../fonts/inter-latin-wght-normal.woff2) format('woff2')}
@font-face{font-family:'Inter';font-style:italic;font-weight:100 900;font-display:block;src:url(../fonts/inter-latin-wght-italic.woff2) format('woff2')}
"""
    return ('<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n'
            '<title>%s</title>\n<style>\nhtml,body{margin:0;height:100%%}\n%s\n%s\n</style>\n</head>\n<body>\n%s\n%s\n%s\n</body>\n</html>\n'
            % (html.escape(titulo), fontes, CSS, ROOT_OPEN, s, ROOT_CLOSE))

def main():
    modo = sys.argv[1] if len(sys.argv) > 1 else 'local'
    if modo == 'local':
        assets = {'FOTO': 'assets/leilson-520.webp', 'MARCA': 'assets/logo-v-dourada.png', 'LOGO_BRANCA': 'assets/logo-h-branca.png'}
        os.makedirs(os.path.join(RAIZ, 'local'), exist_ok=True)
        for stem, titulo, parte, busca in PAGINAS:
            with open(os.path.join(RAIZ, 'local', STEM_LOCAL[stem] + '.html'), 'w', encoding='utf-8') as f:
                f.write(local_html(stem, titulo, parte, assets))
        print('local: ok')
        return
    # canvas
    with open(sys.argv[2], encoding='utf-8') as f:
        assets = json.load(f)
    with open(sys.argv[3], encoding='utf-8') as f:
        alturas = json.load(f)   # {"inicio": {"1440": 5200, "390": 7300}, ...}
    proj = os.path.join(RAIZ, 'project')
    os.makedirs(proj, exist_ok=True)
    W = 1440
    boards, order = {}, []
    x = 0
    for stem, titulo, parte, busca in PAGINAS:
        h = int(alturas[STEM_LOCAL[stem]]['1440'])
        with open(os.path.join(proj, stem + '.dc.html'), 'w', encoding='utf-8') as f:
            f.write(dc(stem, titulo, parte, busca, assets, W, h))
        boards[stem + '.dc.html'] = {'x': x, 'y': 0, 'w': W, 'h': h, 'title': titulo + ' · desktop', 'expand': 'fill', 'is_interactive': True}
        order.append(stem + '.dc.html')
        x += W + 80
    maxh = max(b['h'] for b in boards.values())
    y2 = maxh + 120 + 300
    x = 0
    for stem, titulo, parte, busca in PAGINAS:
        h = int(alturas[STEM_LOCAL[stem]]['390'])
        nome = ('Inicio' if stem == 'Main' else stem) + '-celular.dc.html'
        with open(os.path.join(proj, nome), 'w', encoding='utf-8') as f:
            f.write(CELULAR % {'titulo': titulo, 'fonts': FONTS_LINK, 'h': h, 'stem': stem})
        boards[nome] = {'x': x, 'y': y2, 'w': 390, 'h': h, 'title': titulo + ' · celular', 'is_interactive': True}
        order.append(nome)
        x += 390 + 80
    canvas = {
        'v': 3,
        'createdOnFiles': {'v': 1, 'at': '2026-10-10T23:55:00Z'},
        'title': 'Prévia do site público',
        'launch': {'view': 'canvas'},
        'pages': [],
        'boards': boards,
        'order': order,
        'notes': {
            'desktop': {'x': 0, 'y': -300, 'text': 'Desktop · prévia v2', 'kind': 'title1', 'maxW': 7520},
            'celular': {'x': 0, 'y': y2 - 300, 'text': 'Celular · prévia v2', 'kind': 'title1', 'maxW': 2270},
            'decisoes': {'x': 7700, 'y': 0, 'w': 420, 'fill': 'blue', 'size': 'm',
                         'text': 'Decisões de 11/10 aplicadas\n\n'
                                 '• Três camadas: institucional, áreas e base de respostas. Sem cidades em série, sem blog por data, sem depoimentos.\n'
                                 '• Seis áreas: divórcio, guarda, visitas e convivência, pensão alimentícia, autorização para viagem ao exterior e para mudança de estado.\n'
                                 '• Equipe: por enquanto só o advogado responsável.\n'
                                 '• Nome canônico: Sales Dourado Advogados.\n'
                                 '• Tipografia A: Playfair Display + Inter, com a Playfair itálica como voz da leitora.'},
            'provisorio': {'x': 7700, 'y': 620, 'w': 420, 'fill': 'orange', 'size': 'm',
                           'text': 'Provisório nesta prévia\n\n'
                                   '• Foto: a atual do CRM (recorte de 520 px). As fotos novas entram no lugar, incluindo uma do escritório.\n'
                                   '• Logo: o PNG atual, reduzido. O vetor substitui.\n'
                                   '• Números: os que a página atual publica (10 mil processos, 7 anos no MP). Entram na ficha com fonte e data, ou saem.\n'
                                   '• Endereço e horário: ainda fora; vão para a ficha.\n'
                                   '• Textos de situação e resposta: exemplos, sem revisão do advogado. O texto do escritório é o aprovado em 18/07.'},
        },
        'designSystems': [],
    }
    with open(os.path.join(proj, 'canvas.json'), 'w', encoding='utf-8') as f:
        json.dump(canvas, f, ensure_ascii=False, indent=2)
    print('canvas: ok', {k: (v['w'], v['h']) for k, v in boards.items()})

if __name__ == '__main__':
    main()
