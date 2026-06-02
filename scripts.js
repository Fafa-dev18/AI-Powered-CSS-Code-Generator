let chave = CONFIG.GROQ_API_KEY;
let botao = document.querySelector(".botao-gerar");
let endereco = "https://api.groq.com/openai/v1/chat/completions";

async function gerarIdeia() {
  let textoUsuario = document.querySelector(".caixa-texto").value;
  let blocoCodigo = document.querySelector(".bloco-codigo");
  let resultadocodigo = document.querySelector(".resultado-codigo");

  // Se o usuário não digitar nada, evita requisição desnecessária
  if (!textoUsuario.trim()) {
    blocoCodigo.textContent = "Por favor, digite uma ideia antes de gerar.";
    return;
  }

  // Feedback visual de carregamento
  botao.disabled = true;
  botao.textContent = "Gerando magia... ✨";
  blocoCodigo.textContent = "A IA está pensando...";

  try {
    let resposta = await fetch(endereco, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + chave,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "Você é um gerador de código HTML e CSS. Responda SOMENTE com código puro. NUNCA use crases, markdown ou explicações. Formato: primeiro <style> com o CSS, depois o HTML. Siga EXATAMENTE o que o usuário pedir. Se pedir algo quicando, use translateY no @keyframes. Se pedir algo girando, use rotate.",
          },
          {
            role: "user",
            content: textoUsuario,
          },
        ],
      }),
    });

    if (!resposta.ok) {
      throw new Error(`Erro na API: ${resposta.status}`);
    }

    let dados = await resposta.json();
    let resultado = dados.choices[0].message.content;

    // Atualiza a tela com o resultado
    blocoCodigo.textContent = resultado;
    resultadocodigo.srcdoc = resultado;

  } catch (erro) {
    console.error(erro);
    blocoCodigo.textContent = "Ops! Houve um erro ao gerar o código. Verifique sua API Key ou tente novamente.";
    resultadocodigo.srcdoc = "<h2>Erro ao carregar o preview</h2>";
  } finally {
    // Restaura o botão original após o término (sucesso ou erro)
    botao.disabled = false;
    botao.textContent = "Gerar ideia✨";
  }
}

botao.addEventListener("click", gerarIdeia);