<!-- src/views/NotFoundView.vue -->
<template>
  <div class="not-found">
    <div class="error-container">
      <div class="error-code">404</div>
      <h1>Page Not Found</h1>
      <p>The page you are looking for doesn't exist or has been moved.</p>
      <router-link to="/" class="home-link">Go to Home</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFoundView'
}
</script>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  text-align: center;
}

.error-container {
  max-width: 500px;
  padding: 2rem;
}

.error-code {
  font-size: 5rem;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

h1 {
  margin-bottom: 1rem;
  color: var(--secondary-color);
}

p {
  margin-bottom: 2rem;
  color: #666;
}

.home-link {
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.3s;
}

.home-link:hover {
  background-color: #2980b9;
}
</style>