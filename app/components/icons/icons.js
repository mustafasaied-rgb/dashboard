// Importing `defineAsyncComponent` from Vue to define components asynchronously
import { defineAsyncComponent } from "vue";

// Import all `.vue` files from the current folder using glob pattern
// `import.meta.glob` is a special function in Vite to dynamically import files.
const files = import.meta.glob("./*.vue"); // Lazy loading all components

// Initialize an empty object to store the components
const componentsObject = {};

// Loop through each file and define it as an async component
// This will dynamically load each `.vue` file as an async component
for (const path in files) {
  // Extract the component name from the file path
  const componentName = path.split("/").pop().replace(".vue", "");
  
  // Use `defineAsyncComponent` to make the component lazy-loaded
  componentsObject[componentName] = defineAsyncComponent(() => files[path]());
}

// Export the components as an object
// Now, you can import all the components from this file using named imports.
export default componentsObject;