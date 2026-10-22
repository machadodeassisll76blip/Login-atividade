(() => {
  const chave = "arasakaThemeColor";
  const padrao = "#ed101b";
  const seletor = document.querySelector("#themeColor");
  function aplicar(cor) {
    const valida = /^#[0-9a-f]{6}$/i.test(cor || "") ? cor : padrao;
    document.documentElement.style.setProperty("--red", valida);
    document.documentElement.style.setProperty("--red-hover", "color-mix(in srgb, " + valida + " 78%, white)");
    if (seletor) seletor.value = valida;
    return valida;
  }
  let salva = padrao;
  try { salva = localStorage.getItem(chave) || padrao; } catch {}
  aplicar(salva);
  if (seletor) {
    seletor.addEventListener("input", () => {
      const cor = aplicar(seletor.value);
      try { localStorage.setItem(chave, cor); } catch {}
    });
    seletor.addEventListener("change", () => {
      const cor = aplicar(seletor.value);
      try { localStorage.setItem(chave, cor); } catch {}
    });
  }
})();