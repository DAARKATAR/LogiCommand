async function seedData() {
  console.log("Iniciando inyección de datos de prueba...");
  try {
    const postData = async (url, data) => {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    };

    // Pedido 1: Chapinero a Usaquén (En tránsito con ruta)
    const order1 = await postData('http://localhost:8080/api/orders', {
      customerName: "Clínica Marly",
      originAddress: "Chapinero, Bogotá",
      destinationAddress: "Usaquén, Bogotá",
      originLat: 4.6482,
      originLng: -74.0626,
      destinationLat: 4.6955,
      destinationLng: -74.0326,
      packageDescription: "Suministros Quirúrgicos Urgentes",
      status: "IN_TRANSIT"
    });
    console.log(`Pedido 1 creado con ID: ${order1.id}`);

    // Insertar puntos de tracking para el pedido 1
    await postData('http://localhost:8080/api/tracking', { orderId: order1.id, latitude: 4.6482, longitude: -74.0626 });
    await postData('http://localhost:8080/api/tracking', { orderId: order1.id, latitude: 4.6550, longitude: -74.0590 });
    await postData('http://localhost:8080/api/tracking', { orderId: order1.id, latitude: 4.6650, longitude: -74.0550 });
    await postData('http://localhost:8080/api/tracking', { orderId: order1.id, latitude: 4.6750, longitude: -74.0480 }); // Current

    // Pedido 2: Centro a Suba
    const order2 = await postData('http://localhost:8080/api/orders', {
      customerName: "Tech Corp Latam",
      originAddress: "Centro Histórico, Bogotá",
      destinationAddress: "Suba, Bogotá",
      originLat: 4.5981,
      originLng: -74.0758,
      destinationLat: 4.7414,
      destinationLng: -74.0841,
      packageDescription: "Servidores Rack 2U",
      status: "ASSIGNED"
    });
    console.log(`Pedido 2 creado con ID: ${order2.id}`);

    // Pedido 3: Medellín
    const order3 = await postData('http://localhost:8080/api/orders', {
      customerName: "Exportaciones Medellín",
      originAddress: "El Poblado, Medellín",
      destinationAddress: "Laureles, Medellín",
      originLat: 6.2081,
      originLng: -75.5670,
      destinationLat: 6.2442,
      destinationLng: -75.5985,
      packageDescription: "Muestras de Café Premium",
      status: "DELIVERED"
    });
    console.log(`Pedido 3 creado con ID: ${order3.id}`);

    console.log("¡Datos insertados correctamente!");
  } catch (error) {
    console.error("Error inyectando datos:", error.message);
  }
}

seedData();
