<script lang="ts">
  import Dash from "./Dash.svelte"
  import Hijack from "./Hijack.svelte"
  import Hls from "./Hls.svelte"
  import Normal from "./Normal.svelte"

  let tabs = [
    { name: "Normal", href: "#", current: true },
    { name: "Hls", href: "#", current: false },
    { name: "Dash", href: "#", current: false },
    { name: "Hijack", href: "#", current: false },
  ]

  $: activeTab = tabs.find((tab) => tab.current).name
</script>

<div class="p-4">
  <nav class="-mb-px flex space-x-8 border-gray-200" aria-label="Tabs">
    {#each tabs as tab (tab.name)}
      <a
        on:click={() => {
          tabs = tabs.map((t) => {
            if (t.name === tab.name) {
              return { ...t, current: true }
            } else {
              return { ...t, current: false }
            }
          })
        }}
        class="whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium {tab.current
          ? 'border-violet-500 text-violet-600'
          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
        href={tab.href}
      >
        {tab.name}
      </a>
    {/each}
  </nav>

  <div class="mt-4">
    {#if activeTab === "Normal"}
      <Normal />
    {/if}

    {#if activeTab === "Hls"}
      <Hls />
    {/if}

    {#if activeTab === "Dash"}
      <Dash />
    {/if}

    {#if activeTab === "Hijack"}
      <Hijack />
    {/if}
  </div>
</div>
