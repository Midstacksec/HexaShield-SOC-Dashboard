# 🛡️ HexaShield — Security Operations Center

> Dashboard interativo de cibersegurança com monitoramento em tempo real, cartografia global de ataques e interface gótica corporativa.

![HexaShield Preview](https://img.shields.io/badge/status-live-c0152a?style=for-the-badge&labelColor=0e0e18)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Web Audio API](https://img.shields.io/badge/Web_Audio_API-8b0000?style=for-the-badge&labelColor=0e0e18)

---


O **HexaShield** é um Security Operations Center (SOC) dashboard desenvolvido com HTML, CSS e JavaScript puro — sem frameworks, sem dependências externas. O projeto foi criado para demonstrar habilidades em desenvolvimento front-end combinadas com conhecimento técnico real em cibersegurança.



| Feature | Descrição |
|---|---|
| 🌍 **Mapa Global Animado** | Arcos de ataque em tempo real via Canvas API, com países de origem e destino |
| 📊 **Gráfico de Tráfego** | Curvas Bézier animadas com dados ao vivo (atualização a cada 5s) |
| 🔴 **Feed de Ameaças** | Registro dinâmico com severidade, IP de origem e timestamp relativo |
| 🔍 **Busca e Filtros** | Filtro por severidade (Crítico, Alto, Médio, Baixo) + busca por texto em tempo real |
| 🔔 **Alertas Sonoros** | Sons únicos por tipo de evento via Web Audio API (sem arquivos externos) |
| 🔥 **Regras de Firewall** | CRUD de regras com protocolos, ações e portas |
| 🔒 **Túneis VPN** | Monitoramento de status com indicadores visuais de uptime |
| 🌙 **Tema Claro/Escuro** | Toggle dinâmico com transição suave, preservando a estética gótica |
| 📱 **Responsivo** | Layout adaptado para mobile, tablet e desktop |
| ✨ **Splash Screen** | Tela de intro animada com créditos de autoria |

---

## como você pode usar ?

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/fernandaduarte/hexashield.git
   cd hexashield
   ```

2. **Abra o arquivo no navegador:**
   ```bash
   # Simplesmente abra o arquivo:
   open index.html
   
   # Ou use um servidor local (recomendado):
   npx serve .
   # ou
   python3 -m http.server 8080
   ```

3. **Acesse em:** `http://localhost:8080`

> Não são necessárias instalações, builds ou dependências. Funciona 100% no navegador.

---

## o que eu utilizei?

- **HTML5 Semântico** — estrutura acessível e bem organizada
- **CSS3 Avançado** — variáveis CSS, animações keyframe, Grid, Flexbox, design responsivo
- **JavaScript Vanilla (ES6+)** — sem jQuery, sem frameworks
- **Canvas API** — mapa-múndi e gráfico de tráfego desenhados pixel a pixel
- **Web Audio API** — síntese sonora em tempo real para alertas
- **CSS Custom Properties** — sistema de temas dark/light com tokens de design

---

## estrutura do Projeto

```
hexashield/
│
├── index.html                       # Estrutura HTML e marcação
├── style.css                        # Todos os estilos — temas dark/light, animações, responsivo
├── script.js                        # Lógica JavaScript — Canvas, Web Audio, state, renders
├── HexaShield_Origem_dos_Dados.pdf  # Documentação sobre a origem dos dados
└── README.md                        # Documentação do projeto
```

> Sem frameworks, sem bundlers, sem dependências de build. Funciona direto no navegador — basta abrir o `index.html`.

---

## Qual a Origem dos Dados?

> **Todos os dados exibidos no dashboard são 100% fictícios**, criados artificialmente para fins ilustrativos. Nenhuma informação foi coletada, extraída ou baseada em sistemas reais, empresas ou incidentes reais.


---

## 📬 Contato

**Fernanda Duarte**  
Analista de Cibersegurança & Desenvolvedora Front-end  
Florianópolis — SC, Brasil

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/fernanda-amorim-duarte-8883903a7/)
[![Email](https://img.shields.io/badge/Email-c0152a?style=for-the-badge&logo=gmail&logoColor=white)](mailto:fdservicosdigitais@gmail.com)

---

<div align="center">
  <sub>Desenvolvido com 🖤 por Fernanda Duarte</sub>
</div>
