<script lang="ts">
  import Dash from "./Dash.svelte"
  import Hijack from "./Hijack.svelte"
  import Hls from "./Hls.svelte"

  let tabs = [
    { name: "Hls", href: "#", current: true },
    { name: "Dash", href: "#", current: false },
    { name: "Hijack", href: "#", current: false },
  ]

  $: activeTab = tabs.find((tab) => tab.current).name
</script>

<div class="p-4">
  <div class="border-gray-200">
    <nav class="-mb-px flex space-x-8" aria-label="Tabs">
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
            ? 'border-indigo-500 text-indigo-600'
            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
          href={tab.href}
        >
          {tab.name}
        </a>
      {/each}
    </nav>
  </div>

  <div class="mt-4">
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
