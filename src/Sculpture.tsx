import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, RoundedBox } from '@react-three/drei';

const Sculpture = () => {
  const [acrylicPosts, setAcrylicPosts] = useState(
    Array.from({ length: 121 }, (_, i) => {
      const x = (i % 11) - 5;
      const z = Math.floor(i / 11) - 5;
      const layer = Math.max(Math.abs(x), Math.abs(z));
      return {
        x,
        y: 4,
        z,
        layer,
        color: layer % 3 === 0 ? '#FF5555' : layer % 3 === 1 ? '#55FF55' : '#5555FF',
        size: 12, // Tamaño inicial
        selected: false, // Si está seleccionado
      };
    })
  );

  const [savedDesigns, setSavedDesigns] = useState<Array<typeof acrylicPosts>>([]);
  const [isDragging, setIsDragging] = useState(false);

  const updateSelectedPosts = (key: 'color' | 'size', value: string | number) => {
    setAcrylicPosts((prev) =>
      prev.map((post) => (post.selected ? { ...post, [key]: value } : post))
    );
  };

  const toggleSelection = (index: number) => {
    setAcrylicPosts((prev) =>
      prev.map((post, i) => (i === index ? { ...post, selected: !post.selected } : post))
    );
  };

  const handleMouseDown = (index: number) => {
    setIsDragging(true);
    toggleSelection(index);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseEnter = (index: number) => {
    if (isDragging) {
      toggleSelection(index);
    }
  };

  const saveDesign = () => {
    setSavedDesigns((prev) => [...prev, [...acrylicPosts]]);
    alert('¡Diseño guardado!');
  };

  const deleteDesign = (designIndex: number) => {
    setSavedDesigns((prev) => prev.filter((_, i) => i !== designIndex));
  };

  const loadDesign = (designIndex: number) => {
    setAcrylicPosts([...savedDesigns[designIndex]]);
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Menú lateral */}
      <div
        style={{
          width: '400px',
          padding: '20px',
          background: '#f9f9f9',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          margin: '10px',
        }}
      >
        {/* Controles globales */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px' }}>Color:</label>
          <input
            type="color"
            onChange={(e) => updateSelectedPosts('color', e.target.value)}
            style={{
              width: '100%',
              padding: '5px',
              marginBottom: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
            }}
          />
          <label style={{ display: 'block', marginBottom: '10px' }}>Tamaño:</label>
          <input
            type="number"
            min="1"
            max="20"
            defaultValue={12}
            onChange={(e) => updateSelectedPosts('size', parseFloat(e.target.value))}
            style={{
              width: '95%',
              padding: '5px',
              border: '1px solid #ccc',
              borderRadius: '5px',
            }}
          />
        </div>
{/* Diagrama interactivo */}
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
  <div>
    <button
      onClick={() =>
        setAcrylicPosts((prev) =>
          prev.map((post) => ({ ...post, selected: true }))
        )
      }
      style={{
        padding: '5px 10px',
        background: '#4CAF50',
        color: 'white',
        marginBottom: '10px',
        border: 'none',
        borderRadius: '5px',
        marginRight: '70px',
        cursor: 'pointer',
      }}
    >
      Seleccionar todos
    </button>
    <button
      onClick={() =>
        setAcrylicPosts((prev) =>
          prev.map((post) => ({ ...post, selected: false }))
        )
      }
      style={{
        padding: '5px 10px',
        background: '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
      }}
    >
      Deseleccionar todos
    </button>
  </div>
</div>
<div
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(11, 1fr)',
    gap: '2px',
    marginTop: '10px',
    marginBottom: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '5px',
  }}
  onMouseUp={handleMouseUp}
>
  {acrylicPosts.map((post, index) => (
    <div
      key={index}
      onMouseDown={() => handleMouseDown(index)}
      onMouseEnter={() => handleMouseEnter(index)}
      style={{
        width: '25px',
        height: '25px',
        backgroundColor: post.color,
        border: post.selected ? '2px solid black' : '1px solid #ccc',
        cursor: 'pointer',
      }}
    ></div>
  ))}
</div>
                {/* Botones para guardar/cargar diseños */}
                <div style={{ marginBottom: '20px' }}>
          <button
            onClick={saveDesign}
            style={{
              width: '100%',
              padding: '10px',
              background: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginBottom: '10px',
            }}
          >
            Guardar diseño
          </button>
          {savedDesigns.length > 0 && (
            <div>
              <h4 style={{ marginBottom: '10px' }}>Diseños guardados:</h4>
              {savedDesigns.map((_, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px',
                  }}
                >
                  <button
                    onClick={() => loadDesign(index)}
                    style={{
                      padding: '5px 10px',
                      background: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      marginRight: '10px',
                    }}
                  >
                    Diseño {index + 1}
                  </button>
                  <button
                    onClick={() => deleteDesign(index)}
                    style={{
                      padding: '5px 10px',
                      background: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    Borrar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Escultura */}
      <Canvas style={{ height: '100vh', background: '#e0e0e0' }} camera={{ position: [15, 10, 15], fov: 50 }}>
        <OrbitControls />
        <ambientLight intensity={0.7} />
        <pointLight position={[15, 15, 15]} intensity={1} />

        {/* Base */}
        <RoundedBox position={[0.13, -3.5, 0]} args={[12, 0.3, 12]}>
          <meshPhysicalMaterial
            color="#ddd"
            transmission={0.8}
            opacity={0.3}
            transparent
          />
        </RoundedBox>

        {/* Pared lateral */}
        <RoundedBox position={[-6, 3.26, 0]} args={[0.3, 13.8, 12]}>
          <meshPhysicalMaterial
            color="#ddd"
            roughness={0.1}
            transmission={0.8}
            opacity={0.3}
            transparent
          />
        </RoundedBox>

        {/* Techo */}
        <RoundedBox position={[0.13, 10, 0]} args={[12, 0.3, 12]}>
          <meshPhysicalMaterial
            color="#ddd"
            roughness={0.1}
            transmission={0.8}
            opacity={0.3}
            transparent
          />
        </RoundedBox>

        {/* Palitos de acrílico */}
        {acrylicPosts.map((post, index) => (
          <mesh
            key={index}
            position={[post.x, post.y - post.size / 2 + 6, post.z]}
          >
            <cylinderGeometry args={[0.1, 0.1, post.size, 32]} />
            <meshPhysicalMaterial
              color={post.color}
              roughness={0.3}
              transmission={0.8}
              opacity={0.5}
              transparent
            />
          </mesh>
        ))}
      </Canvas>
    </div>
  );
};

export default Sculpture;