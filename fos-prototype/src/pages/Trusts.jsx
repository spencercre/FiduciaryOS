import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SEED_TRUSTS } from '../data/mockData';
import { ChevronRight } from 'lucide-react';

export function Trusts({ trusts }) {
    const navigate = useNavigate();
    const displayTrusts = trusts.length ? trusts : SEED_TRUSTS;

    return (
        <div className="space-y-6 animate-fadeIn">
            <h2 className="font-serif text-2xl font-bold text-stone-900">My Trusts</h2>
            <div className="grid gap-4">
                {displayTrusts.map((trust) => (
                    <div key={trust.id} onClick={() => navigate(`/trusts/${trust.id}`)} className="walnut-card cursor-pointer hover:shadow-md">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <h3 className="font-bold text-stone-800 text-lg font-serif">{trust.name}</h3>
                                <ChevronRight size={20} className="text-racing-green ml-2"/>
                            </div>
                            <span className="text-sm text-stone-500 font-serif">{trust.situs}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
