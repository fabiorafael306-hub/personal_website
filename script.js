document.addEventListener('DOMContentLoaded', () => {
    initMenuToggle();
    initActiveNav();
    initScrollReveal();
    initContactForm();
    initProjectImageInteraction();
});

function initMenuToggle() {
    const toggle = document.querySelector('.menu-toggle');
    const links = document.querySelector('.barra-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
        const abrindo = !links.classList.contains('aberto');
        links.classList.toggle('aberto', abrindo);
        toggle.classList.toggle('ativo', abrindo);
        toggle.setAttribute('aria-expanded', String(abrindo));
    });

    links.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            links.classList.remove('aberto');
            toggle.classList.remove('ativo');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
}

function initActiveNav() {
    const links = document.querySelectorAll('.barra-links a');
    if (!links.length) return;

    const linkPorId = new Map();
    links.forEach((link) => {
        const id = link.getAttribute('href').replace('#', '');
        linkPorId.set(id, link);
    });

    const alvos = [...linkPorId.keys()]
        .map((id) => document.getElementById(id))
        .filter(Boolean);

    if (!alvos.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const link = linkPorId.get(entry.target.id);
                if (!link) return;
                links.forEach((l) => l.classList.remove('ativo'));
                link.classList.add('ativo');
            });
        },
        { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    alvos.forEach((alvo) => observer.observe(alvo));
}

function initScrollReveal() {
    const itens = document.querySelectorAll('.reveal');
    if (!itens.length) return;

    if (!('IntersectionObserver' in window)) {
        itens.forEach((el) => el.classList.add('reveal-visivel'));
        return;
    }

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visivel');
                    obs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    itens.forEach((el) => observer.observe(el));
}

function initContactForm() {
    const form = document.getElementById('contatoForm');
    if (!form) return;

    const campoNome = document.getElementById('campoNome');
    const campoEmail = document.getElementById('campoEmail');
    const campoMensagem = document.getElementById('campoMensagem');
    const erroNome = document.getElementById('erroNome');
    const erroEmail = document.getElementById('erroEmail');
    const erroMensagem = document.getElementById('erroMensagem');
    const status = document.getElementById('formStatus');
    const botao = form.querySelector('button[type="submit"]');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validar() {
        let valido = true;

        if (campoNome.value.trim().length < 2) {
            erroNome.textContent = 'Digite seu nome.';
            valido = false;
        } else {
            erroNome.textContent = '';
        }

        if (!emailRegex.test(campoEmail.value.trim())) {
            erroEmail.textContent = 'Digite um e-mail válido.';
            valido = false;
        } else {
            erroEmail.textContent = '';
        }

        if (campoMensagem.value.trim().length < 10) {
            erroMensagem.textContent = 'Escreva uma mensagem um pouco maior.';
            valido = false;
        } else {
            erroMensagem.textContent = '';
        }

        return valido;
    }

    [campoNome, campoEmail, campoMensagem].forEach((campo) => {
        campo.addEventListener('blur', validar);
    });

    form.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        status.textContent = '';
        status.className = 'form-status';

        if (!validar()) {
            status.textContent = 'Corrija os campos destacados acima.';
            status.classList.add('erro');
            return;
        }

        const dados = {
            nome: campoNome.value.trim(),
            email: campoEmail.value.trim(),
            mensagem: campoMensagem.value.trim(),
        };

        botao.disabled = true;
        botao.textContent = 'enviando...';

        try {
            const resposta = await fetch('https://formspree.io/f/mwlkeqzn', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(dados),
            });

            if (!resposta.ok) throw new Error('Falha no envio');

            status.textContent = 'Mensagem enviada! Vou te responder em breve.';
            status.classList.add('sucesso');
            form.reset();
        } catch (erro) {
            status.textContent =
                'Não consegui enviar agora. Tenta de novo em instantes ou me chama direto por e-mail.';
            status.classList.add('erro');
        } finally {
            botao.disabled = false;
            botao.textContent = 'enviar';
        }
    });
}

function initProjectImageInteraction() {
    const imagens = document.querySelectorAll('.projeto-imgs img');
    if (!imagens.length) return;

    imagens.forEach((img) => {
        img.addEventListener('click', () => {
            imagens.forEach((i) => i.classList.remove('img-destaque'));
            img.classList.add('img-destaque');
        });
    });
}