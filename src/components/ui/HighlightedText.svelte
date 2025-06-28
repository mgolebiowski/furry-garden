<script lang="ts">
  export let text = '';
  export let indices: readonly [number, number][] = [];

  function getHighlightedParts(text: string, indices: readonly [number, number][]) {
    const parts = [];
    let lastIndex = 0;

    indices.forEach(([start, end]) => {
      if (start > lastIndex) {
        parts.push({ text: text.substring(lastIndex, start), highlighted: false });
      }
      parts.push({ text: text.substring(start, end + 1), highlighted: true });
      lastIndex = end + 1;
    });

    if (lastIndex < text.length) {
      parts.push({ text: text.substring(lastIndex), highlighted: false });
    }

    return parts;
  }

  $: parts = getHighlightedParts(text, indices);
</script>

<span>
  {#each parts as part}
    {#if part.highlighted}
      <mark class="bg-yellow-200 dark:bg-yellow-600 rounded-sm">{part.text}</mark>
    {:else}
      {part.text}
    {/if}
  {/each}
</span>
