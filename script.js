// ========== STORAGE ==========
const STORAGE_KEY = "irmanufa_gallery";

// DATA DEFAULT (4 KEGIATAN)
const defaultData = [
  {
    id: "1",
    nama: "Kabinet IRMANUFA GG & ALL STARS",
    link: "https://drive.google.com/drive/u/6/folders/1a8JuSkVHQiWga8ds0XpZvdF6nuCXlE-K",
    icon: "🏆",
  },
  {
    id: "2",
    nama: "Takbir Keliling",
    link: "https://s.id/fotokegiatantarlingujay2026",
    icon: "🕌",
  },
  {
    id: "3",
    nama: "Penyambutan Bulan Suci Ramadhan",
    link: "https://drive.google.com/drive/folders/1_lKXooPkIq4tCP-DX14dHmwLPHJjmj_c",
    icon: "🌙",
  },
  {
    id: "4",
    nama: "Gallery Irmanufa Random",
    link: "https://drive.google.com/drive/folders/1dTlVLOKSiIm73yqxgFOcyOIiM4PC8LPT",
    icon: "📸",
  },
];

function getData() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    return [...defaultData];
  }
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : [...defaultData];
  } catch (e) {
    return [...defaultData];
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(
    new StorageEvent("storage", {
      key: STORAGE_KEY,
      newValue: JSON.stringify(data),
    }),
  );
}

function openDrive(url) {
  if (url) window.open(url, "_blank");
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  if (toast) {
    toast.innerText = msg || "🔄 Data diperbarui!";
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/[&<>]/g, (m) => {
    if (m === "&") return "&amp;";
    if (m === "<") return "&lt;";
    if (m === ">") return "&gt;";
    return m;
  });
}

let searchQuery = "";

// ========== RENDER USER ==========
function renderUser() {
  let data = getData();
  if (searchQuery) {
    data = data.filter((item) =>
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }

  const gridView = document.getElementById("gridView");
  if (data.length === 0) {
    gridView.innerHTML =
      '<div class="empty-state"><i class="fas fa-folder-open"></i><h3>Kosong</h3><p>Belum ada kegiatan</p></div>';
  } else {
    gridView.innerHTML = data
      .map(
        (item) => `
            <div class="gallery-card" onclick="openDrive('${item.link}')">
                <div class="card-icon">${item.icon || "📁"}</div>
                <div class="card-info">
                    <h3>${escapeHtml(item.nama)}</h3>
                    <p><i class="fab fa-google-drive"></i> Klik lihat foto</p>
                </div>
            </div>
        `,
      )
      .join("");
  }

  const listView = document.getElementById("listView");
  if (data.length === 0) {
    listView.innerHTML =
      '<div class="empty-state"><i class="fas fa-folder-open"></i><h3>Kosong</h3><p>Belum ada kegiatan</p></div>';
  } else {
    listView.innerHTML = data
      .map(
        (item) => `
            <div class="list-item" onclick="openDrive('${item.link}')">
                <div class="list-icon">${item.icon || "📁"}</div>
                <div class="list-info">
                    <h3>${escapeHtml(item.nama)}</h3>
                    <p><i class="fab fa-google-drive"></i> Google Drive</p>
                </div>
                <div class="list-arrow"><i class="fas fa-chevron-right"></i></div>
            </div>
        `,
      )
      .join("");
  }
}

// ========== VIEW TOGGLE ==========
function setupViewToggle() {
  const gridBtn = document.querySelector('.view-btn[data-view="grid"]');
  const listBtn = document.querySelector('.view-btn[data-view="list"]');
  const gridView = document.getElementById("gridView");
  const listView = document.getElementById("listView");

  gridBtn.onclick = () => {
    gridBtn.classList.add("active");
    listBtn.classList.remove("active");
    gridView.style.display = "grid";
    listView.style.display = "none";
  };

  listBtn.onclick = () => {
    listBtn.classList.add("active");
    gridBtn.classList.remove("active");
    gridView.style.display = "none";
    listView.style.display = "flex";
  };
}

// ========== SEARCH ==========
function setupSearch() {
  const input = document.getElementById("searchInput");
  input.oninput = () => {
    searchQuery = input.value;
    renderUser();
  };
}

// ========== SIDEBAR ==========
function setupSidebar() {
  const menuBtn = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const closeBtn = document.getElementById("closeSidebar");

  const close = () => {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
  };

  menuBtn.onclick = () => {
    sidebar.classList.add("open");
    overlay.classList.add("show");
  };
  closeBtn.onclick = close;
  overlay.onclick = close;
}

// ========== RENDER ADMIN ==========
function renderAdminTable() {
  const tbody = document.getElementById("kegiatanList");
  if (!tbody) return;

  const data = getData();
  const totalSpan = document.getElementById("totalCount");
  if (totalSpan) totalSpan.innerText = data.length;

  if (data.length === 0) {
    tbody.innerHTML =
      '<table><td colspan="4" class="text-center">Belum ada data</td></tr>';
    return;
  }

  tbody.innerHTML = data
    .map(
      (item) => `
        <tr>
            <td class="table-icon">${item.icon || "📁"}</td>
            <td><strong>${escapeHtml(item.nama)}</strong></td>
            <td><a href="${item.link}" target="_blank" style="color:#667eea;">📂 Buka Drive</a></td>
            <td>
                <button class="btn-edit" onclick="editKegiatan('${item.id}')">✏️ Edit</button>
                <button class="btn-delete" onclick="deleteKegiatan('${item.id}')">🗑️ Hapus</button>
            </td>
        </tr>
    `,
    )
    .join("");
}

// ========== ADMIN FORM ==========
function setupAdminForm() {
  const form = document.getElementById("kegiatanForm");
  if (!form) return;

  form.onsubmit = (e) => {
    e.preventDefault();

    const editId = document.getElementById("editId").value;
    const nama = document.getElementById("namaKegiatan").value.trim();
    const link = document.getElementById("linkDrive").value.trim();
    let icon = document.getElementById("iconUrl").value.trim();

    if (!nama || !link) {
      Swal.fire("Error", "Nama dan link wajib diisi!", "error");
      return;
    }
    if (!icon) icon = "📁";

    const data = getData();

    if (editId) {
      const idx = data.findIndex((i) => i.id === editId);
      if (idx !== -1) {
        data[idx] = { ...data[idx], nama, link, icon };
        saveData(data);
        Swal.fire("Berhasil", "Data diupdate", "success");
      }
    } else {
      data.push({ id: Date.now().toString(), nama, link, icon });
      saveData(data);
      Swal.fire("Berhasil", "Kegiatan ditambahkan", "success");
    }

    resetForm();
    renderAdminTable();
    renderUser();
    showToast("Data tersimpan!");
  };

  const cancelBtn = document.getElementById("cancelBtn");
  if (cancelBtn) cancelBtn.onclick = resetForm;
}

function editKegiatan(id) {
  const item = getData().find((i) => i.id === id);
  if (item) {
    document.getElementById("editId").value = item.id;
    document.getElementById("namaKegiatan").value = item.nama;
    document.getElementById("linkDrive").value = item.link;
    document.getElementById("iconUrl").value = item.icon || "";
    document.getElementById("formTitle").innerHTML = "✏️ Edit Kegiatan";
    document
      .querySelector(".admin-card")
      .scrollIntoView({ behavior: "smooth" });
  }
}

function deleteKegiatan(id) {
  Swal.fire({
    title: "Yakin hapus?",
    text: "Data akan dihapus permanen!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#e74c3c",
    confirmButtonText: "Ya, Hapus!",
  }).then((result) => {
    if (result.isConfirmed) {
      const newData = getData().filter((i) => i.id !== id);
      saveData(newData);
      renderAdminTable();
      renderUser();
      Swal.fire("Terhapus!", "Data berhasil dihapus", "success");
      if (document.getElementById("editId").value === id) resetForm();
    }
  });
}

function resetForm() {
  document.getElementById("editId").value = "";
  document.getElementById("namaKegiatan").value = "";
  document.getElementById("linkDrive").value = "";
  document.getElementById("iconUrl").value = "";
  document.getElementById("formTitle").innerHTML = "➕ Tambah Kegiatan";
}

// ========== INIT ==========
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("gridView")) {
    renderUser();
    setupSearch();
    setupViewToggle();
    setupSidebar();

    window.addEventListener("storage", (e) => {
      if (e.key === STORAGE_KEY) {
        renderUser();
        showToast("Galeri diperbarui!");
      }
    });
  }
});

// Export global
window.openDrive = openDrive;
window.editKegiatan = editKegiatan;
window.deleteKegiatan = deleteKegiatan;
window.renderAdminTable = renderAdminTable;
window.setupAdminForm = setupAdminForm;
window.getData = getData;
