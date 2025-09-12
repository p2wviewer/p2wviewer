<script>
  import { open, save, message } from '@tauri-apps/plugin-dialog';
  import { createEventDispatcher } from 'svelte';
  import { get } from 'svelte/store';
  import { t } from '../lib/i18n.js';
  import { Command } from '@tauri-apps/plugin-shell';
  //import { invoke } from '@tauri-apps/api/tauri';

  const dispatch = createEventDispatcher();

  let encryptedFilePath = '';
  let saveLocationPath = '';
  let keyFilePath = '';
  let password = '';
  let showLog = false;

  function goBack() {
    dispatch('return'); 
  }

  async function chooseEncryptedFile() {
    const selected = await open({
      multiple: false,
      directory: true,
      title: get(t).choose_encrypted_file,
      filters: [{
        name: 'Image',
        extensions: ['png']
      }]
    });
    if (selected) {
      encryptedFilePath = selected;
      if (!saveLocationPath && typeof selected === 'string') {
        const pathParts = selected.split(/[\/\\]/);
        const fileName = pathParts.pop();
        const dir = pathParts.join('/');
        const cleanFileName = fileName ? fileName.replace(/^encrypted_/, '') : 'file';
        saveLocationPath = `${dir}/decrypted_${cleanFileName}`;
      }
    }
  }

  async function chooseSaveLocation() {
    const selected = await save({
      title: get(t).choose_save_location,
      defaultPath: saveLocationPath || encryptedFilePath || 'decrypted_file',
      filters: [{
        name: 'Image',
        extensions: ['png', 'jpeg', 'jpg']
      }]
    });
    if (selected) {
      saveLocationPath = selected;
    }
  }

  async function chooseKeyFile() {
    const selected = await open({
      multiple: false,
      title: get(t).choose_key_file,
    });
    if (selected) {
      keyFilePath = selected;
    }
  }

  async function startDecryption() {
    if (!encryptedFilePath) {
      await message(get(t).encrypted_file_empty, { kind: 'error' });
      return;
    }
    if (!saveLocationPath) {
      await message(get(t).save_location_empty, { kind: 'error' });
      return;
    }
    if (!keyFilePath && !password) {
      await message(get(t).key_file_or_pwd_empty, { kind: 'warning' });
      return;
    }
    if (keyFilePath && password) {
      await message(get(t).key_file_and_pwd_same_time, { kind: 'warning'});
      return;
    }

    try {
      const args = [
        "decrypt",
        "-i", encryptedFilePath,
        "-o", saveLocationPath,
        "-vvv",
      ];
      if (password) {
        args.push("-p", password);
      } else if (keyFilePath) {
        args.push("--password-file", keyFilePath);
      }

      const command = Command.sidecar("binaries/libp2wviewer", args);
      const result = await command.execute();

      console.log("Decryption result:", result);
      if (showLog) {
        await message(get(t).run_decryption_finish_with_log + "\n\n" + result.stdout, { kind: "info" });
      } else {
        await message(get(t).run_decryption_finished, { kind: "info" });
      }
    } catch (error) {
      console.error("Decryption failed:", error);
      let errorMessage = "Unknown error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message);
      }
      await message(get(t).run_decryption_failed + "\n\n" + errorMessage, { kind: "error" });
    }
  }
</script>

<div class="page-container">
  <button class="back-button" on:click={goBack}>
    &larr; {$t.back_button}
  </button>

  <h1>{$t.decrypt_page_title}</h1>

  <section class="block">
    <h2>{$t.file_options}</h2>
    <div class="input-group">
      <label for="encryptedFile">{$t.encrypted_file}</label>
      <div class="file-input-row">
        <input id="encryptedFile" type="text" bind:value={encryptedFilePath} placeholder="{$t.choose_encrypted_file}" readonly />
        <button on:click={chooseEncryptedFile}>{$t.choose_file}</button>
      </div>
    </div>

    <div class="input-group">
      <label for="saveLocation">{$t.save_location}:</label>
      <div class="file-input-row">
        <input id="saveLocation" type="text" bind:value={saveLocationPath} placeholder="{$t.choose_save_location}" readonly />
        <button on:click={chooseSaveLocation}>{$t.choose_file}</button>
      </div>
    </div>
  </section>

  <section class="block">
    <h2 class="section-title-with-tip">
      {$t.key_or_pwd}
      <span class="tooltip">{$t.key_password_tip}</span>
    </h2>
    <p class="hint">{$t.pwd_disclaimer}</p>

    <div class="input-group">
      <label for="keyFile">{$t.choose_key_file}:</label>
      <div class="file-input-row">
        <input id="keyFile" type="text" bind:value={keyFilePath} placeholder={$t.choose_key_file} readonly />
        <button on:click={chooseKeyFile}>{$t.choose_file}</button>
      </div>
    </div>

    <div class="input-group">
      <label for="password">{$t.pwd}:</label>
      <input id="password" type="password" bind:value={password} placeholder={$t.pwd_placeholder} />
    </div>
  </section>

  <div class="checkbox-container">
    <input type="checkbox" id="showLog" bind:checked={showLog} />
    <label for="showLog">{$t.log}</label>
  </div>

  <button class="start-decrypt" on:click={startDecryption}>
    {$t.start_decrypt}
  </button>
</div>

<style>
.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 5%;
  gap: 20px;
  width: 100%; 
  box-sizing: border-box;
  margin: 0 auto;
  background-color: #f8f9fa;
}

h1 {
  color: #333;
  font-size: clamp(1.5em, 5vw, 2.2em);
  margin-bottom: 25px;
  text-align: center;
}

.block {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 25px;
  width: 100%;
  box-sizing: border-box;
}

.block h2 {
  color: #444;
  font-size: 1.5em;
  margin-top: 0;
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.section-title-with-tip {
  justify-content: space-between;
}

.tooltip {
  font-size: 0.85em;
  color: #777;
  font-weight: normal;
  background-color: #f0f0f0;
  padding: 4px 8px;
  border-radius: 5px;
  text-align: right;
}

.hint {
  font-size: 0.9em;
  color: #777;
  margin-top: -10px;
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 18px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
}

.file-input-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.file-input-row input[type="text"] {
  flex-grow: 1;
  background-color: #e9ecef;
  color: #6c757d;
  min-width: 0;
}

input[type="text"],
input[type="password"]{
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  font-size: 1em;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input[type="text"]:focus,
input[type="password"]:focus{
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

button {
  background-color: #007bff;
  color: white;
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out;
}

button:hover {
  background-color: #0056b3;
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}

.start-decrypt {
  background-color: #dc3545;
  font-size: 1.2em;
  padding: 12px 25px;
  margin-top: 20px;
  box-shadow: 0 4px 10px rgba(220, 53, 69, 0.2);
}

.start-decrypt:hover {
  background-color: #c82333;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
}

.checkbox-container input[type="checkbox"] {
  width: 18px;
  height: 18px;
}

.checkbox-container label {
  font-size: 1em;
  color: #555;
}

.back-button {
  align-self: flex-start;
  background-color: transparent;
  color: #007bff;
  border: none;
  padding: 8px 12px;
  font-size: 1.1em;
  margin-bottom: 15px;
}

.back-button:hover {
  text-decoration: underline;
  background-color: #f0f0f0;
}

@media (min-width: 600px) {
  .page-container {
    padding: 20px;
    max-width: 800px;
    align-self: flex-start;
  }
  .file-input-row {
    flex-direction: row;
  }
  .block h2 {
    flex-wrap: nowrap;
  }
}
</style>