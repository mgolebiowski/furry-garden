<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { createEventDispatcher, onMount } from 'svelte';

  export let isOpen = false;

  const dispatch = createEventDispatcher();
  let modalElement: HTMLDivElement;

  function closeModal() {
    dispatch('close');
  }

  function handleUnderstood() {
    dispatch('understood');
  }

  // Focus management for accessibility
  onMount(() => {
    if (isOpen && modalElement) {
      const focusableElements = modalElement.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }
  });

  // Handle escape key
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeModal();
    }
  }

  // Trap focus within modal
  function handleTabKeydown(event: KeyboardEvent) {
    if (event.key !== 'Tab') return;

    const focusableElements = modalElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (event.shiftKey) {
      if (document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    }
  }
</script>

{#if isOpen}
  <!-- Modal backdrop -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div 
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    on:click={closeModal}
    on:keydown={handleKeydown}
  >
    <!-- Modal content -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div 
      bind:this={modalElement}
      class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto"
      on:click|stopPropagation
      on:keydown={handleTabKeydown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      tabindex="-1"
    >
      <!-- Modal header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 id="modal-title" class="text-xl font-semibold text-gray-900 dark:text-white">
          {$_('disclaimer.title')}
        </h2>
        <button 
          on:click={closeModal}
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Close modal"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Modal body -->
      <div class="p-6">
        <div id="modal-description" class="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          {$_('disclaimer.content')}
        </div>
        
        <div class="mb-6">
          <a 
            href={$_('disclaimer.githubLink')} 
            target="_blank" 
            rel="noopener noreferrer"
            class="text-blue-600 dark:text-blue-400 hover:underline break-all"
          >
            {$_('disclaimer.githubLink')}
          </a>
        </div>

        <!-- Modal actions -->
        <div class="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            on:click={handleUnderstood}
            class="w-full sm:w-auto px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            {$_('disclaimer.understood')}
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Prevent body scroll when modal is open */
  :global(body.modal-open) {
    overflow: hidden;
  }
</style>
