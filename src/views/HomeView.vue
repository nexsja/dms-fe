<!-- src/views/HomeView.vue -->
<template>
  <div class="home">
    <div class="hero">
      <h1>Welcome to PDF Marker</h1>
      <p>Add comments and annotations to your PDF documents</p>
      <router-link to="/documents" class="cta-button">View Documents</router-link>
    </div>

    <div class="features">
      <div class="feature-card">
        <div class="feature-icon">💬</div>
        <h2>Add Comments</h2>
        <p>Mark specific areas in your documents and add comments or feedback.</p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">✅</div>
        <h2>Track Progress</h2>
        <p>Keep track of which comments have been resolved and which need attention.</p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">👥</div>
        <h2>Collaborate</h2>
        <p>Share documents with your team and collaborate on reviews and feedback.</p>
      </div>
    </div>

    <div class="get-started">
      <h2>How to Get Started</h2>
      <div class="steps">
        <div class="step">
          <div class="step-number">1</div>
          <h3>Upload Document</h3>
          <p>Upload your PDF document to the system.</p>
        </div>

        <div class="step">
          <div class="step-number">2</div>
          <h3>Add Comments</h3>
          <p>Click on the document where you want to add comments.</p>
        </div>

        <div class="step">
          <div class="step-number">3</div>
          <h3>Resolve Issues</h3>
          <p>Address comments and mark them as resolved when complete.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView'
}
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
}

.hero {
  text-align: center;
  padding: 3rem 1rem;
  margin-bottom: 3rem;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--secondary-color);
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #666;
}

.cta-button {
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.3s;
}

.cta-button:hover {
  background-color: #2980b9;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.feature-card {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h2 {
  margin-bottom: 1rem;
  color: var(--secondary-color);
}

.get-started {
  padding: 3rem 0;
}

.get-started h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--secondary-color);
}

.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.step {
  text-align: center;
  padding: 1.5rem;
  border-radius: 8px;
  background-color: var(--light-gray);
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  margin: 0 auto 1rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: 50%;
  font-size: 1.5rem;
  font-weight: bold;
}

.step h3 {
  margin-bottom: 0.5rem;
  color: var(--secondary-color);
}
</style>