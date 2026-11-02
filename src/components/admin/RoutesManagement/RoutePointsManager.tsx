// --- Путь: src/components/admin/RoutesManagement/RoutePointsManager.tsx ---
// ПОЛНАЯ ВЕРСИЯ

import React, { useState, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import type { RoutePointsManagerProps } from '../../../types/admin/Routes/route_props.types';
import type { PointBase } from '../../../types/admin/Points/point.types';
import { Input } from '../../ui/Input/Input';
import { Button } from '../../ui/Button/Button';
import './RoutePointsManager.css';

export const RoutePointsManager: React.FC<RoutePointsManagerProps> = ({
  allPoints,
  selectedPoints,
  onPointsChange,
  disabled,
}) => {
  const [search, setSearch] = useState('');

  const availablePoints = useMemo(() => {
    const selectedIds = new Set(selectedPoints.map(p => p.id));
    return allPoints
      .filter(p => !selectedIds.has(p.id))
      .filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  }, [allPoints, selectedPoints, search]);

  const handleAddPoint = (point: PointBase) => {
    if (disabled) return;
    onPointsChange([...selectedPoints, point]);
  };

  const handleRemovePoint = (pointId: number) => {
    if (disabled) return;
    onPointsChange(selectedPoints.filter(p => p.id !== pointId));
  };
  
  const onDragEnd = (result: DropResult) => {
    if (!result.destination || disabled) return;
    const items = Array.from(selectedPoints);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    onPointsChange(items);
  };

  return (
    // Этот div теперь главный контейнер для менеджера
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="form-group" style={{ flexShrink: 0, marginBottom: '1rem' }}>
        <Input
          type="text"
          placeholder="Поиск по названию..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="points-search-input"
          disabled={disabled}
        />
      </div>

      <div className="points-manager">
        {/* Левая колонка: все доступные точки */}
        <div className="points-column">
          <h5 className="points-column-title">Доступные точки ({availablePoints.length})</h5>
          <ul className="points-list">
            {availablePoints.map(point => (
              <li key={point.id} className="point-item available">
                <span className="point-name">{point.name} (ID: {point.id})</span>
                <Button size="sm" variant="outline" onClick={() => handleAddPoint(point)} disabled={disabled}>Добавить →</Button>
              </li>
            ))}
            {availablePoints.length === 0 && <li className="point-item-empty">Нет доступных точек</li>}
          </ul>
        </div>

        {/* Правая колонка: выбранные точки */}
        <div className="points-column">
          <h5 className="points-column-title">Точки в маршруте ({selectedPoints.length})</h5>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="selected-points">
              {(provided) => (
                <ul {...provided.droppableProps} ref={provided.innerRef} className="points-list selected">
                  {selectedPoints.map((point, index) => (
                    <Draggable key={point.id} draggableId={String(point.id)} index={index}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="point-item selected"
                        >
                          <span className="point-order">{index + 1}.</span>
                          <span className="point-name">{point.name}</span>
                          <Button size="sm" variant="destructive" onClick={() => handleRemovePoint(point.id)} disabled={disabled}>×</Button>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {selectedPoints.length === 0 && <li className="point-item-empty">Перетащите или добавьте точки</li>}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
};