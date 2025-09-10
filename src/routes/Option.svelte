<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  function selectOption(option) {
    dispatch('select', option);
  }
</script>

<div class="options-container">
  <button class="option-button" on:click={() => selectOption('encrypt')}>
    <div class="button-content">
      <h2>Encrypt</h2>
    </div>
  </button>

  <button class="option-button" on:click={() => selectOption('decrypt')}>
    <div class="button-content">
      <h2>Decrypt</h2>
    </div>
  </button>
</div>

<style>
  .options-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 30px;
    height: 100vh;
    width: 100vw;
    background-color: #f0f2f5;
  }

  .option-button {
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    cursor: pointer;
    padding: 30px 40px;
    width: 280px;
    height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    transition: all 0.2s ease-in-out;
    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  }

  .option-button:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    transform: translateY(-5px);
    border-color: #007bff;
  }

  .option-button:active {
    transform: translateY(-2px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  }

  .button-content h2 {
    color: #333333;
    margin-top: 15px;
    margin-bottom: 10px;
    font-size: 1.8em;
    font-weight: 600;
  }

  .button-content p {
    color: #666666;
    font-size: 1.1em;
    line-height: 1.4;
  }
</style>