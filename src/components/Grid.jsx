import React, { useState, useEffect, useRef } from 'react';
import styles from './Grid.module.css';

const Grid = () => {
    const gridRef = useRef(null);
    const [dimensions, setDimensions] = useState({ rows: 15, cols: 20 });
    const [grid, setGrid] = useState([]);
    const [currentColor, setCurrentColor] = useState(`hsla(${Math.random() * 360}, 100%, 50%, 1)`);

    useEffect(() => {
        const initialGrid = Array.from({length: dimensions.rows}, () =>
            Array.from({ length: dimensions.cols }, () => null)
        );
        setGrid(initialGrid);
    },[dimensions]);

    useEffect(() => {
        const updateGridDimensions = () => {
            if(gridRef.current){
                const gridWidth = gridRef.current.offsetWidth;
                const gridHeight = gridRef.current.offsetHeight;
                const cellSize = 30;
                const newCols = Math.floor(gridWidth / cellSize);
                const newRows = Math.floor(gridHeight / cellSize);
                setDimensions({ rows: newRows, cols: newCols });
            }
        };
        const resizeObserver = new ResizeObserver(() => {
            updateGridDimensions();
        });
        if(gridRef.current){
            resizeObserver.observe(gridRef.current);
        }
        return () => {
            if(gridRef.current){
                resizeObserver.unobserve(gridRef.current);
            }
        };
    },[]);

    useEffect(() => {
        const colorInterval = setInterval(() => {
            setCurrentColor(`hsla(${Math.random() * 360}, 100%, 50%, 1)`);
        },3000);
        return () => clearInterval(colorInterval);
    },[]);

    useEffect(() =>{
        const interval = setInterval(() => {
            setGrid((prevGrid) => {
                const newGrid = Array.from({ length: dimensions.rows }, () =>
                    Array.from({ length: dimensions.cols }, () => null)
                );
                for(let row = dimensions.rows - 1; row >= 0; row--){
                    for(let col = 0; col < dimensions.cols; col++){
                        if(prevGrid[row][col]){
                            const droplet = prevGrid[row][col];
                            if(row + 1 < dimensions.rows){
                                newGrid[row + 1][col] = { ...droplet, color: currentColor };
                            }
                        }
                    }
                }
                if(Math.random() < 0.3){
                    const dropletHeight = 3 + Math.floor(Math.random() * 7);
                    const dropletParts = Array.from({ length: dropletHeight }, (_, i) => {
                        return{
                            color: currentColor,
                        };
                    });
                    dropletParts.push({ color: 'black' });
                    const randomColumn = Math.floor(Math.random() * dimensions.cols);
                    for(let i = 0; i < dropletParts.length; i++){
                        newGrid[i][randomColumn] = dropletParts[i];
                    }
                }
                return newGrid;
            });
        }, 80);
        return () => clearInterval(interval);
    },[dimensions, currentColor]);

    const { rows, cols } = dimensions;

    return (
        <>
            <div className={styles.gridMain} ref={gridRef} style={{ gridTemplateRows: `repeat(${rows}, 1fr)`, gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
                {grid.flat().map((cell, index) => (
                    <div key={index} className={styles.square} style={{ backgroundColor: cell ? cell.color : 'black', transition: 'background-color 0.2s', }}>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Grid;
