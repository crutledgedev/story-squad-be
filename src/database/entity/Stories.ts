import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

import { Child } from './Child';
import { Pages, Transcribed_Pages } from './Pages';

@Entity()
class Stories {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    childId: number;
    @ManyToOne(
        (type) => Child,
        (child) => child.stories,
        { onDelete: 'CASCADE' }
    )
    @JoinColumn()
    child: Child;

    @Column({ nullable: false })
    week: number;

    @Column((type) => Pages)
    story: Pages;

    @Column({ nullable: true })
    storyText: string;

    @Column({ nullable: true })
    points: number;

    @Column({ type: 'double precision', nullable: true })
    flesch_reading_ease: number;

    @Column({ type: 'double precision', nullable: true })
    smog_index: number;

    @Column({ type: 'double precision', nullable: true })
    flesch_kincaid_grade: number;

    @Column({ type: 'double precision', nullable: true })
    coleman_liau_index: number;

    @Column({ type: 'double precision', nullable: true })
    automated_readability_index: number;

    @Column({ type: 'double precision', nullable: true })
    dale_chall_readability_score: number;

    @Column({ type: 'double precision', nullable: true })
    difficult_words: number;

    @Column({ type: 'double precision', nullable: true })
    linsear_write_formula: number;

    @Column({ type: 'double precision', nullable: true })
    gunning_fog: number;

    @Column({ nullable: true })
    consolidated_score: string;

    @Column({ nullable: true })
    doc_length: number;

    @Column({ nullable: true })
    quote_count: number;

    @Column(() => Transcribed_Pages)
    transcribed_text: Transcribed_Pages;
}

export { Stories };