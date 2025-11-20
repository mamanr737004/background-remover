let uploadedFile = null;

function removeBackground() {
  const input = document.getElementById("imageInput");
  const originalImage = document.getElementById("originalImage");
  const resultImage = document.getElementById("resultImage");
  const originalSize = document.getElementById("originalSize");
  const resultSize = document.getElementById("resultSize");
  const downloadBtn = document.getElementById("downloadBtn");
  const bgColorContainer = document.getElementById("bgColorContainer");

  if (input.files.length === 0) {
    alert("Pilih gambar terlebih dahulu!");
    return;
  }

  uploadedFile = input.files[0];
  const formData = new FormData();
  formData.append("image", uploadedFile);

  // Tampilkan gambar asli & ukuran file asli
  const reader = new FileReader();
  reader.onload = function (e) {
    originalImage.src = e.target.result;
    originalSize.textContent = `Ukuran: ${(uploadedFile.size / 1024).toFixed(2)} KB`;
  };
  reader.readAsDataURL(uploadedFile);

  // Kirim gambar ke server
  fetch("/remove-bg", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
        return;
      }
      const imageUrl = "data:image/png;base64," + data.image_base64;
      resultImage.src = imageUrl;
      resultSize.textContent = `Ukuran: ${data.result_size_kb} KB`;

      // Aktifkan tombol download
      downloadBtn.href = imageUrl;
      downloadBtn.classList.remove("hidden");

      // Tampilkan pilihan ganti warna latar
      bgColorContainer.classList.remove("hidden");
    })
    .catch((err) => {
      alert("Terjadi kesalahan: " + err.message);
    });
}

function applyBackgroundColor() {
  if (!uploadedFile) {
    alert("Unggah gambar terlebih dahulu!");
    return;
  }
  const color = document.getElementById("bgColor").value;
  const resultImage = document.getElementById("resultImage");
  const resultSize = document.getElementById("resultSize");
  const downloadBtn = document.getElementById("downloadBtn");

  const formData = new FormData();
  formData.append("image", uploadedFile);
  formData.append("bg_type", "color");
  formData.append("color", color);

  fetch("/remove-bg", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      const imageUrl = "data:image/png;base64," + data.image_base64;
      resultImage.src = imageUrl;
      resultSize.textContent = `Ukuran: ${data.result_size_kb} KB`;
      downloadBtn.href = imageUrl;
    })
    .catch((err) => {
      alert("Gagal menerapkan warna latar: " + err.message);
    });
}

function resetImages() {
  document.getElementById("originalImage").src = "/static/image/default.png";
  document.getElementById("resultImage").src = "/static/image/default.png";
  document.getElementById("originalSize").textContent = "Ukuran: - KB";
  document.getElementById("resultSize").textContent = "Ukuran: - KB";
  document.getElementById("imageInput").value = "";
  document.getElementById("downloadBtn").classList.add("hidden");
  document.getElementById("bgColorContainer").classList.add("hidden");
  uploadedFile = null;
}

// Event listener saat file dipilih
document.getElementById("imageInput").addEventListener("change", function () {
  const file = this.files[0];
  const originalImage = document.getElementById("originalImage");
  const originalSize = document.getElementById("originalSize");

  if (file) {
    // Pastikan tipe file sesuai
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      alert("Hanya file JPG dan PNG yang diperbolehkan!");
      this.value = "";
      return;
    }

    // Tampilkan preview & ukuran
    const reader = new FileReader();
    reader.onload = function (e) {
      originalImage.src = e.target.result;
      originalSize.textContent = `Ukuran: ${(file.size / 1024).toFixed(2)} KB`;
    };
    reader.readAsDataURL(file);
  }
});
