from pathlib import Path
import shutil, json, re, subprocess
import yaml

root=Path(__file__).resolve().parents[1]
source=root/'.tools/classmate-template'
backup=root/'.tools/backup-before-careercanvas'
if backup.exists() and any(backup.iterdir()): raise SystemExit('Backup already exists; migration will not overwrite it.')
backup.mkdir(parents=True,exist_ok=True)
for name in ['layouts','content','assets','i18n','themes']:
    src=(root/name).resolve(); dst=(backup/name).resolve()
    assert src.is_relative_to(root) and dst.is_relative_to(root)
    if src.exists(): src.rename(dst)
for name in ['hugo.toml','README.md']:
    shutil.copy2(root/name,backup/name)
for name in ['layouts','assets','i18n','themes']:
    shutil.copytree(source/name,root/name)
shutil.copytree(backup/'layouts/shortcodes',root/'layouts/shortcodes',dirs_exist_ok=True)
for name in ['tailwind.config.js','postcss.config.js']:
    shutil.copy2(source/name,root/name)

def write(path,text):
    p=root/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(text,encoding='utf-8')
def page(path,meta,body=''):
    write(path,'---\n'+yaml.safe_dump(meta,allow_unicode=True,sort_keys=False)+'---\n\n'+body+'\n')
def read_page(path):
    text=path.read_text(encoding='utf-8'); _,front,body=text.split('---',2)
    return yaml.safe_load(front),body.strip()

config=(source/'hugo.toml').read_text(encoding='utf-8')
config=config.replace('baseURL = "/"','baseURL = "https://davidghelman388-collab.github.io/"').replace('defaultContentLanguageInSubdir = false','defaultContentLanguageInSubdir = true')
config=config.replace('熊浩','谭立星').replace('Hao Xiong','Lixing Tan').replace('firstName = "熊"','firstName = "谭"').replace('lastName = "浩"','lastName = "立星"').replace('firstName = "Hao"','firstName = "Lixing"').replace('lastName = "Xiong"','lastName = "Tan"')
config=config.replace('能源与动力工程 · 氢能 · 机器学习','金融工程 · 金融学 · 数据科学').replace('Energy and Power Engineering · Hydrogen Energy · Machine Learning','Financial Engineering · Finance · Data Science')
config=config.replace('华中科技大学能源与动力工程硕士研究生。关注氢能与能源系统建模，开展数值仿真、机器学习与数据分析实践。','大连理工大学经济学本科生，预计 2027 年毕业。关注金融工程、金融学与数据科学，探索金融理论与机器学习在资产定价中的结合。')
config=config.replace('MEng student in Energy and Power Engineering at Huazhong University of Science and Technology. My work explores hydrogen and energy-system modeling through numerical simulation, machine learning and data analysis.','Economics undergraduate at Dalian University of Technology, graduating in 2027. Interested in financial engineering, finance, and data science, with research connecting asset pricing and machine learning.')
config=config.replace('["graduation-thesis", "huawei-cup-multimodal-sentiment"]','["option-pricing", "quant-investment"]')
config=config.replace('武汉，中国','大连理工大学').replace('Wuhan, China','Dalian University of Technology')
config=config.replace('Hydrogen Energy','Financial Engineering').replace('Renewable Energy','Finance').replace('Machine Learning','Data Science')
config=config.replace('xionghao_research@163.com','tanlixing27@163.com').replace('https://github.com/xiong-H6776','https://github.com/davidghelman388-collab').replace('github.com/xiong-H6776','github.com/davidghelman388-collab')
config=config.replace('/images/profile.jpg','/images/portrait.jpg').replace('/files/xiong-hao-cv.pdf','/files/lixing-tan-cv-zh.pdf')
# English language block gets its own English public CV.
enstart=config.index('  [languages.en]');enend=config.index('[build]')
config=config[:enstart]+config[enstart:enend].replace('/files/lixing-tan-cv-zh.pdf','/files/lixing-tan-cv-en.pdf')+config[enend:]
config=config.replace('languageCode = "zh-CN"','locale = "zh-CN"').replace('languageCode = "en"','locale = "en"')
config=re.sub(r'^\s*languageName = .*\n','\n',config,flags=re.M)
config=config.replace('主页——能源与动力工程、氢能、可再生能源、机器学习与数据驱动能源系统。','主页——金融工程、金融学与数据科学研究及实践。')
config=config.replace("Lixing Tan's academic homepage — energy and power engineering, hydrogen energy, renewable energy, machine learning, and data-driven energy systems.","Lixing Tan's academic and professional homepage — financial engineering, finance, and data science.")
# Replace inactive blog/certificates navigation with actual personal content.
config=config.replace('name = "博客"','name = "经历与荣誉"').replace('name = "Blog"','name = "Experience"').replace('pageRef = "/blog"','pageRef = "/experience"')
config=config.replace('name = "证书"','name = "关于我"').replace('name = "Certificates"','name = "About"').replace('pageRef = "/certificates"','pageRef = "/about"')
write('hugo.toml',config)

profile=json.loads((root/'data/profile.json').read_text(encoding='utf-8'))
for lang in ['zh','en']:
    p=profile[lang];zh=lang=='zh';old=backup/'content'/lang
    page(f'content/{lang}/_index.md',{'title':p['name']})
    about_meta,about_body=read_page(old/'about.md')
    about_meta.update({
      'intro':p['aboutText'],'study':p['degree']+' · '+p['exchangeDate'],
      'passion_title':p['focusTitle'],'passion_text':' '.join(f['text'] for f in p['focus']),
      'mix':p['toolIntro'],'personal':p['personalText'],
      'education':[{'school':p['school'],'degree':p['degree']+' · '+p['grade'],'period':'2023.09 – 2027.06'},{'school':'厦门大学' if zh else 'Xiamen University','degree':'经济学交流学习' if zh else 'Academic exchange · Economics','period':'2024.09 – 2025.07'}],
      'quickfacts':[
        {'title':'关注方向' if zh else 'Interests','kind':'interests','value':'金融工程\n金融学\n数据科学' if zh else 'Financial engineering\nFinance\nData science','icon':'chart-line'},
        {'title':'学习成绩' if zh else 'Academic record','value':p['grade'],'icon':'graduation-cap'},
        {'title':'语言' if zh else 'Languages','kind':'languages','value':'IELTS Academic 6.5 · Reading 8.0','icon':'language'},
        {'title':'个人兴趣' if zh else 'Beyond study','value':'足球 · 唱歌' if zh else 'Football · Singing','icon':'music'}]})
    page(f'content/{lang}/about/_index.md',about_meta,about_body)
    exp_meta,exp_body=read_page(old/'experience.md')
    positions=[{'company':p['school'],'role':p['degree'],'period':'2023.09 – 2027.06','bullet_points':[p['grade'],p['paperTitle']]},
      {'company':'厦门大学' if zh else 'Xiamen University','role':'经济学交流学习' if zh else 'Academic exchange · Economics','period':'2024.09 – 2025.07','bullet_points':[p['exchangeDate']]}]
    for j in p['jobs']:
      positions.append({'company':j['company'],'role':j['role'],'period':j['date'],'bullet_points':[j['text']]})
    exp_meta.update({'intro':p['pathText'],'resume_downloads':[{'lang':'zh','label':'中文'},{'lang':'en','label':'English'}],'positions':positions})
    page(f'content/{lang}/experience/_index.md',exp_meta,exp_body)
    page(f'content/{lang}/skills/_index.md',{'title':p['focusTitle'],'intro':p['toolIntro'],'domains':[{'title':f['title'],'description':f['text'],'icon':icon} for f,icon in zip(p['focus'],['chart-line','university','brain'])],'technical':[]})
    page(f'content/{lang}/technical/_index.md',{'title':p['toolTitle'],'intro':p['toolNote'],'technical_groups':[{'title':g['title'],'skills':[{'name':n,'local_icon':f'/images/tools/{n.lower()}.svg'} for n in g['tools']]} for g in p['groups']]})
    page(f'content/{lang}/contact/_index.md',{'title':'联系方式' if zh else 'Contact','intro':p['contactText']},'[tanlixing27@163.com](mailto:tanlixing27@163.com) · [GitHub](https://github.com/davidghelman388-collab)')
    group={'id':'undergraduate','title':'本科研究与实践' if zh else 'Undergraduate research','period':'2023–2027','description':'金融理论与数据方法的结合。' if zh else 'Connecting financial theory and empirical methods.'}
    page(f'content/{lang}/projects/_index.md',{'title':p['allProjects'],'project_groups':[group],'aliases':[f'/{lang}/research/']},p['focusTitle'])
    for slug in ['option-pricing','quant-investment']:
      meta,body=read_page(old/f'research/{slug}.md')
      meta.update({'stage':'undergraduate','outcomes':[meta['status']],'aliases':[f'/{lang}/research/{slug}/']})
      page(f'content/{lang}/projects/{slug}.md',meta,body)
    page(f'content/{lang}/research/publications.md',{'title':'论文与报告' if zh else 'Publications & reports','highlights':[{'kind':'会议论文' if zh else 'Conference paper','year':2026,'title':p['paperTitle'],'authors':'Lixing Tan','venue':'AEMPS 267, 181–188 · ICEMGD 2026','status':'已发表' if zh else 'Published','file':'https://doi.org/10.54254/2754-1169/2026.33880','project':'/projects/option-pricing'}]},f"## {p['paperTitle']}\n\nLixing Tan (2026). *Advances in Economics, Management and Political Sciences*, 267, 181–188.\n\n[DOI](https://doi.org/10.54254/2754-1169/2026.33880)")
    meta,body=read_page(old/'cv.md');page(f'content/{lang}/cv.md',meta,body)

# Retain upstream markup and animations, update deprecated Hugo accessors.
for p in list((root/'layouts').rglob('*.html'))+list((root/'themes').rglob('*.html')):
    s=p.read_text(encoding='utf-8').replace('.Language.LanguageCode','.Language.Locale').replace('.Site.Data','hugo.Data').replace('site.Data','hugo.Data')
    p.write_text(s,encoding='utf-8')
# Modern home lookup; shared upstream base remains used.
shutil.copy2(root/'layouts/_default/index.html',root/'layouts/home.html')
base=(root/'themes/careercanvas/layouts/_default/baseof.html').read_text(encoding='utf-8')
start=base.index('    {{ $styles :=');end=base.index('    <style>',start)
base=base[:start]+'''    <link rel="stylesheet" href="{{ "css/template.css" | relURL }}">
    <link rel="stylesheet" href="{{ "vendor/fontawesome/css/all.min.css" | relURL }}">
    <link rel="stylesheet" href="{{ "css/personal.css" | relURL }}">
'''+base[end:]
base=base.replace('visibility: hidden;','visibility: visible;')
base=base.replace('    <script src="https://cdn.jsdelivr.net/npm/fslightbox/index.js"></script>','')
base=base.replace('    <script src="{{ $gsap.RelPermalink }}"></script>','    <script src="{{ "vendor/gsap/gsap.min.js" | relURL }}"></script>\n    <script src="{{ $gsap.RelPermalink }}"></script>\n    <script defer src="{{ "js/template-personal.js" | relURL }}"></script>')
write('layouts/_default/baseof.html',base)
# Avoid external icon assets; keep same icon tiles with local sources.
tech=(root/'themes/careercanvas/layouts/partials/technical.html').read_text(encoding='utf-8')
tech=tech.replace('{{ if .devicon_name }}','''{{ if .local_icon }}
                  <div class="h-16 flex items-center justify-center mb-1"><img src="{{ .local_icon | relURL }}" alt="" width="64" height="64" loading="lazy" class="w-16 h-16 rounded-md p-1 bg-white" /></div>
                {{ else if .devicon_name }}''')
write('layouts/partials/technical.html',tech)
head=(root/'themes/careercanvas/layouts/partials/head.html').read_text(encoding='utf-8')
head=re.sub(r'<link rel="stylesheet" href="https://(?:cdnjs|cdn\.jsdelivr)[^\n]+\n','',head)
head=head.replace('href="/favicon.ico"','href="{{ "images/favicon.svg" | relURL }}"')
write('layouts/partials/head.html',head)
# Same footer layout; small source attribution.
footer=(root/'themes/careercanvas/layouts/partials/footer.html').read_text(encoding='utf-8')
footer=footer.replace('</footer>','<p class="template-credit">Theme: CareerCanvas / Felipe Cordero · Adapted from <a href="https://github.com/xiong-H6776/xiong-H6776.github.io">Xiong Hao</a>, used with permission.</p></footer>')
write('layouts/partials/footer.html',footer)
shutil.copy2(root/'.tools/gsap/package/dist/gsap.min.js',root/'static/vendor/gsap/gsap.min.js')
shutil.copy2(root/'.tools/gsap/package/package.json',root/'static/vendor/gsap/package.json')
shutil.copy2(root/'themes/careercanvas/LICENSE',root/'static/vendor/CAREERCANVAS-LICENSE.txt')
package=json.loads((root/'package.json').read_text(encoding='utf-8'))
package.update({'name':'lixing-tan-personal-site','private':True,'scripts':{'css':'node node_modules/tailwindcss/lib/cli.js -i themes/careercanvas/assets/css/main.css -o static/css/template.css --minify','build':'npm run css && hugo --minify','dev':'npm run css && hugo server'}})
write('package.json',json.dumps(package,indent=2)+'\n')
print('Migrated authorized template; previous website preserved at',backup)
