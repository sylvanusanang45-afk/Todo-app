
function Settings({
  userEmail,
  theme,
  sortOrder,
  layout,
  onThemeChange,
  onSortChange,
  onLayoutChange,
  onClose,
}) {
  return (
    <div className="settings-overlay" onClick={onClose}>
      <div
        className="settings-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="settings-header">
          <div>
            <h2 id="settings-title">Settings</h2>
            <p>Customize your workspace</p>
          </div>

          <button
            type="button"
            className="settings-close"
            onClick={onClose}
            aria-label="Close settings"
          >
            ×
          </button>
        </div>

        <section className="settings-section">
          <h3>Account</h3>

          <div className="settings-option">
            <div>
              <strong>Email address</strong>
              <p>{userEmail}</p>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <h3>Appearance</h3>

          <div className="settings-option">
            <div>
              <strong>Theme</strong>
              <p>Choose your preferred appearance.</p>
            </div>

            <select
              value={theme}
              onChange={(event) => onThemeChange(event.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </section>

        <section className="settings-section">
          <h3>Task preferences</h3>

          <div className="settings-option">
            <div>
              <strong>Sort tasks</strong>
              <p>Choose which tasks appear first.</p>
            </div>

            <select
              value={sortOrder}
              onChange={(event) => onSortChange(event.target.value)}
            >
              <option value="oldest">Oldest first</option>
              <option value="newest">Newest first</option>
            </select>
          </div>

          <div className="settings-option">
            <div>
              <strong>Task layout</strong>
              <p>Choose how your task cards are displayed.</p>
            </div>

            <select
              value={layout}
              onChange={(event) => onLayoutChange(event.target.value)}
            >
              <option value="comfortable">Comfortable</option>
              <option value="compact">Compact</option>
            </select>
          </div>
        </section>

        <button
          type="button"
          className="settings-done"
          onClick={onClose}
        >
          Done
        </button>
      </div>
    </div>
  );
}

export default Settings;
