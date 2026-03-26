export type Skill = {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    level: SkillLevel;
    userId: string;
}

export enum SkillLevel {
    BEGINNER,
    INTERMEDIATE,
    ADVANCED,
    EXPERT,
  }
  