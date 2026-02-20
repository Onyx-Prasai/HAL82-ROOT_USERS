import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';

const TagSelector = ({ selectedTags, onTagsChange, tags, maxSelection, required = false }) => {
    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            onTagsChange(selectedTags.filter(t => t !== tag));
        } else {
            if (maxSelection && selectedTags.length >= maxSelection) {
                return;
            }
            onTagsChange([...selectedTags, tag]);
        }
    };

    const isSelected = (tag) => selectedTags.includes(tag);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <label className="block text-sm font-black text-surface-text-muted uppercase tracking-widest pl-2">
                    Interest Tags
                </label>
                {required && <span className="text-xs text-red-500 font-bold">Required</span>}
                {maxSelection && <span className="text-xs text-surface-text-muted">Max: {maxSelection}</span>}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {tags.map((tag) => (
                    <motion.button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative p-4 rounded-2xl border-2 font-bold text-sm transition-all flex items-center justify-between ${
                            isSelected(tag)
                                ? 'border-sangam-emerald bg-sangam-emerald/10 shadow-lg shadow-sangam-emerald/20 text-sangam-emerald'
                                : 'border-surface-border bg-surface-card text-surface-text hover:border-surface-text-muted/30'
                        }`}
                    >
                        <span>{tag}</span>
                        {isSelected(tag) ? (
                            <CheckCircle2 size={18} className="text-sangam-emerald" />
                        ) : (
                            <Circle size={18} className="text-surface-border" />
                        )}
                    </motion.button>
                ))}
            </div>

            {required && selectedTags.length === 0 && (
                <p className="text-xs text-red-500 font-bold pl-2">
                    Please select at least one interest tag
                </p>
            )}
        </div>
    );
};

export default TagSelector;
