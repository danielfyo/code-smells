import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SmellyLocalStorageJsonService } from './smelly';
import { UserPreferencesStore } from './refactored';

describe('wrong-abstraction-level-name', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('both versions return the defaults when nothing was saved', () => {
    expect(TestBed.inject(SmellyLocalStorageJsonService).readLocalStorageJsonOrDefault()).toEqual({ theme: 'light', language: 'en' });
    expect(TestBed.inject(UserPreferencesStore).load()).toEqual({ theme: 'light', language: 'en' });
  });

  it('both versions persist and restore preferences in the same format', () => {
    TestBed.inject(SmellyLocalStorageJsonService).writeLocalStorageJson({ theme: 'dark', language: 'es' });
    expect(TestBed.inject(UserPreferencesStore).load()).toEqual({ theme: 'dark', language: 'es' });

    TestBed.inject(UserPreferencesStore).save({ theme: 'light', language: 'fr' });
    expect(TestBed.inject(SmellyLocalStorageJsonService).readLocalStorageJsonOrDefault()).toEqual({ theme: 'light', language: 'fr' });
  });
});
