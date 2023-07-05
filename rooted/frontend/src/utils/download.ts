export const downloadTxtFile = (data: string, name: string) => {
  return () => {
    const element = document.createElement("a");
    document.body.appendChild(element);

    const file = new Blob([data], {
      type: "text/plain;charset=utf8;"
    });
    element.style.display = "none";
    element.href = window.URL.createObjectURL(file);
    element.download = name;
    element.click();

    document.body.removeChild(element);
  }
};