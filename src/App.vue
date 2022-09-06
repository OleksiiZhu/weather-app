<template>
  <Weather/>
</template>

<script>
import Weather from './components/Weather.vue'

export default {
  name: 'App',
  components: {
    Weather,
  }
}
</script>

<style>
:root {
  --main-text-color: #2c3e50;
  --hover-bg-color: #f0f0f0;
  --title-color: #272727;
  --error-color: #FF0000FF;
  --error-hover-color: #f20000;
  --transition-duration: 0.2s;
}
#app {
  font-family: 'Bebas Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--main-text-color);
  margin-top: 60px;
}

button {
  outline: none;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 10px;
  font-weight: bold;
  font-size: 20px;
  line-height: 1.2;
  display: flex;
  padding: 12px 15px;
  transition: var(--transition-duration);
}

button:hover {
  background: var(--hover-bg-color);
}
</style>
