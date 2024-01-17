import { Test, TestingModule } from '@nestjs/testing';
import { EnvironmentService } from './environment.service';


describe('EnvironmentService', () => {
  let service: EnvironmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnvironmentService],
    }).compile();

    service = module.get<EnvironmentService>(EnvironmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return the environment value', ()=>{
    expect(service.getOrDefault('TZ','defaultValue')).toEqual('defaultValue')
  })
});
