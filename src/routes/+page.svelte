<script>
  import Ov from './Option.svelte';
  import Rd from './RunDecrypt.svelte';
  import Re from './RunEncrypt.svelte';
  let currentView = 'options';
  let selectedOption = '';
</script>

<main>
  {#if currentView === 'options'}
    <Ov on:select={(event) => {
      selectedOption = event.detail;
      currentView = 'run';
    }}/>
  {:else if currentView === 'run'}
    {#if selectedOption === 'encrypt'}
      <Re on:return={() => {
        currentView = 'options';
        selectedOption = '';
      }}/>
    {:else if selectedOption === 'decrypt'}
      <Rd on:return={() => {
        currentView = 'options';
        selectedOption = '';
      }}/>
    {/if}
  {/if}
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  }
  main {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
  }
</style>