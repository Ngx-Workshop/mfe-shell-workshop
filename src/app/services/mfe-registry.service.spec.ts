import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import type { MfeRemoteDto } from '@tmdjr/ngx-mfe-orchestrator-contracts';
import { NgxNavigationalListService } from '@tmdjr/ngx-navigational-list';
import { MfeRegistryService } from './mfe-registry.service';

describe('MfeRegistryService domain loading', () => {
  it('requests its shell domain and keeps server-selected records regardless of legacy flags', () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: NgxNavigationalListService, useValue: {} },
      ],
    });
    const service = TestBed.inject(MfeRegistryService);
    const http = TestBed.inject(HttpTestingController);
    const remotes = [
      { _id: 'one', type: 'user-journey', isAdmin: true },
    ] as MfeRemoteDto[];
    let received: MfeRemoteDto[] = [];
    service.loadMfeRemotes().subscribe((value) => (received = value));
    http.expectOne('/api/mfe-remotes/domain/workshop').flush(remotes);
    expect(received).toEqual(remotes);
    expect(service.remotes.value).toEqual(remotes);
    http.verify();
  });
});
