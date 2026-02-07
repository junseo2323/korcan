'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { format } from 'date-fns'
import { Check, Trash2, Plus } from 'lucide-react'
import { useTodo } from '@/contexts/TodoContext'

const ListContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  background-color: white;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.05);
  margin-top: -1rem; /* Overlap slightly or simply sit tight */
  z-index: 10;
`

const ListHeader = styled.div`
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text.primary};
`

const Item = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral.gray100};
  gap: 0.75rem;
`

const CheckBox = styled.button<{ $completed: boolean; $color: string }>`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 2px solid ${({ theme, $completed, $color }) => $completed ? $color : $color || theme.colors.neutral.gray300};
  background-color: ${({ theme, $completed, $color }) => $completed ? $color : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  
  transition: all 0.2s;
`

const ItemText = styled.span<{ $completed: boolean }>`
  flex: 1;
  font-size: 1rem;
  color: ${({ theme, $completed }) => $completed ? theme.colors.text.disabled : theme.colors.text.primary};
  text-decoration: ${({ $completed }) => $completed ? 'line-through' : 'none'};
`

const DeleteBtn = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.neutral.gray300};
  cursor: pointer;
  &:hover { color: ${({ theme }) => theme.colors.status.error}; }
`

const InputArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  
`

const AddInput = styled.input`
  width: 100%;
  padding: 0.75rem 0;
  border: none;
  font-size: 1rem;
  outline: none;
  background: transparent;
  
  &::placeholder {
      color: ${({ theme }) => theme.colors.text.disabled};
  }
`

const TagSelector = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`

const ColorDot = styled.button<{ $color: string; $selected: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${({ $color }) => $color};
  border: 2px solid ${({ $selected, $color }) => $selected ? 'black' : 'transparent'};
  cursor: pointer;
  transition: transform 0.1s;
  
  &:hover { transform: scale(1.1); }
`

// TodoMate inspired colors
const TAG_COLORS = [
    '#FF6B6B', // Red
    '#4ECDC4', // Mint
    '#FFA502', // Orange
    '#3742FA', // Blue
    '#A55EEA', // Purple
    '#747D8C'  // Gray
]

interface Props {
    selectedDate: Date
}

export default function TodoListView({ selectedDate }: Props) {
    const { getTodosByDate, addTodo, toggleTodo, deleteTodo } = useTodo()
    const [text, setText] = useState('')
    const [selectedColor, setSelectedColor] = useState(TAG_COLORS[1]) // Default to Mint

    const dateStr = format(selectedDate, 'yyyy-MM-dd')
    const todos = getTodosByDate(dateStr)

    const handleAdd = () => {
        if (!text.trim()) return
        addTodo(text, dateStr, selectedColor)
        setText('')
    }

    return (
        <ListContainer>
            <ListHeader>{format(selectedDate, 'M월 d일')}</ListHeader>

            {todos.length === 0 && (
                <div style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    할 일이 없습니다.
                </div>
            )}

            {todos.map(todo => (
                <Item key={todo.id}>
                    <CheckBox
                        $completed={todo.completed}
                        $color={todo.color || '#ccc'}
                        onClick={() => toggleTodo(todo.id)}
                    >
                        {todo.completed && <Check size={16} />}
                    </CheckBox>
                    <ItemText $completed={todo.completed}>{todo.text}</ItemText>
                    <DeleteBtn onClick={() => deleteTodo(todo.id)}>
                        <Trash2 size={16} />
                    </DeleteBtn>
                </Item>
            ))}

            <InputArea>
                <AddInput
                    placeholder="+ 할 일 추가"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAdd()}
                />
                <TagSelector>
                    {TAG_COLORS.map(color => (
                        <ColorDot
                            key={color}
                            $color={color}
                            $selected={selectedColor === color}
                            onClick={() => setSelectedColor(color)}
                        />
                    ))}
                </TagSelector>
            </InputArea>
        </ListContainer>
    )
}
