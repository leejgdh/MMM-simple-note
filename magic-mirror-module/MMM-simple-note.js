Module.register("MMM-simple-note", {
  defaults: {
    updateInterval: 60000,
    animationSpeed: 2000,
    maxNotes: 5,
    showTitle: true,
    apiUrl: "http://localhost:3000/api"
  },

  notes: [],

  start: function() {
    Log.info("Starting module: " + this.name);
    this.loaded = false;
    this.getNotes();
    setInterval(() => {
      this.getNotes();
    }, this.config.updateInterval);
  },

  getNotes: function() {
    fetch(this.config.apiUrl + "/notes")
      .then(response => response.json())
      .then(data => {
        this.notes = data;
        this.loaded = true;
        this.updateDom(this.config.animationSpeed);
      })
      .catch(error => {
        Log.error("Error fetching notes:", error);
        this.loaded = true;
        this.updateDom(this.config.animationSpeed);
      });
  },

  getDom: function() {
    const wrapper = document.createElement("div");
    wrapper.className = "simple-note-wrapper";

    if (!this.loaded) {
      wrapper.innerHTML = this.translate("LOADING");
      wrapper.className = "dimmed light small";
      return wrapper;
    }

    if (this.notes.length === 0) {
      wrapper.innerHTML = this.translate("NO_NOTES");
      wrapper.className = "dimmed light small";
      return wrapper;
    }

    const notesContainer = document.createElement("div");
    notesContainer.className = "notes-container";

    this.notes.slice(0, this.config.maxNotes).forEach(note => {
      const noteElement = document.createElement("div");
      noteElement.className = "note-item";

      if (this.config.showTitle && note.title) {
        const titleElement = document.createElement("div");
        titleElement.className = "note-title bright small";
        titleElement.innerHTML = note.title;
        noteElement.appendChild(titleElement);
      }

      const contentElement = document.createElement("div");
      contentElement.className = "note-content light xsmall";
      contentElement.innerHTML = note.content;
      noteElement.appendChild(contentElement);

      if (note.createdAt) {
        const dateElement = document.createElement("div");
        dateElement.className = "note-date dimmed xsmall";
        const date = new Date(note.createdAt);
        dateElement.innerHTML = date.toLocaleDateString() + " " + date.toLocaleTimeString();
        noteElement.appendChild(dateElement);
      }

      notesContainer.appendChild(noteElement);
    });

    wrapper.appendChild(notesContainer);
    return wrapper;
  },

  getStyles: function() {
    return ["MMM-simple-note.css"];
  },

  getTranslations: function() {
    return {
      en: "translations/en.json",
      ko: "translations/ko.json"
    };
  },

  notificationReceived: function(notification, payload, sender) {
    // Handle any module notifications if needed
  }
});