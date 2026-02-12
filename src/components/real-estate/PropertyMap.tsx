'use client'

import React, { useState, useEffect } from 'react'
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps'
import styled from 'styled-components'

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
`

const PriceTag = styled.div<{ $selected?: boolean }>`
  background: ${({ theme, $selected }) => $selected ? theme.colors.primary : 'white'};
  color: ${({ theme, $selected }) => $selected ? 'white' : theme.colors.text.primary};
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 0.8rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  cursor: pointer;
  transform: ${({ $selected }) => $selected ? 'scale(1.1)' : 'scale(1)'};
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
    z-index: 10;
  }
`

interface Property {
    id: string
    latitude: number
    longitude: number
    price: number
    currency: string
    title: string
}

interface PropertyMapProps {
    properties: Property[]
    selectedId: string | null
    onSelect: (id: string) => void
    onBoundsChanged?: (bounds: any) => void
}

const DEFAULT_CENTER = { lat: 43.6532, lng: -79.3832 } // Toronto

export default function PropertyMap({ properties, selectedId, onSelect, onBoundsChanged }: PropertyMapProps) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

    if (!apiKey) return <div>Map API Key Missing</div>

    return (
        <APIProvider apiKey={apiKey}>
            <MapContainer>
                <Map
                    defaultCenter={DEFAULT_CENTER}
                    defaultZoom={12}
                    mapId="DEMO_MAP_ID" // Required for AdvancedMarker
                    onCameraChanged={(ev) => {
                        // console.log('Camera changed:', ev.detail.bounds)
                        if (onBoundsChanged) onBoundsChanged(ev.detail.bounds)
                    }}
                    disableDefaultUI={true}
                    zoomControl={true}
                    gestureHandling={'greedy'}
                >
                    {properties.map(property => (
                        <AdvancedMarker
                            key={property.id}
                            position={{ lat: property.latitude, lng: property.longitude }}
                            onClick={() => onSelect(property.id)}
                            zIndex={selectedId === property.id ? 100 : 1}
                        >
                            <PriceTag $selected={selectedId === property.id}>
                                {property.currency === 'KRW'
                                    ? `${(property.price / 10000).toFixed(0)}만`
                                    : `$${property.price}`
                                }
                            </PriceTag>
                        </AdvancedMarker>
                    ))}
                </Map>
            </MapContainer>
        </APIProvider>
    )
}
