import { TestBed } from '@angular/core/testing';
import { DataService } from './data.service';
import { UIElement } from './classes/UIElement';
import { PropertyKey } from './classes/interfaces';

describe('DataService', () => {
  let dataService: DataService;
  beforeEach(() => {
    TestBed.configureTestingModule({
    });
    dataService = TestBed.inject(DataService);
  });

  it('should check input script header for validity and accepted version', () => {
    dataService.setElements(['iqb-scripted::1.0'], {});
    expect(dataService.rootBlock.elements.length).toEqual(0);

    let errorText = '';
    dataService.setElements([''], {});
    errorText = (dataService.rootBlock.elements[0] as UIElement).properties.get(PropertyKey.TEXT);
    expect(errorText).toEqual('Scriptfehler: Kein Keyword gefunden!');

    dataService.setElements(['iqb-scripted'], {});
    errorText = (dataService.rootBlock.elements[0] as UIElement).properties.get(PropertyKey.TEXT);
    expect(errorText).toEqual('Scriptfehler: Kein Version-Parameter gefunden!');

    dataService.setElements(['iqb-scripted::aa'], {});
    errorText = (dataService.rootBlock.elements[0] as UIElement).properties.get(PropertyKey.TEXT);
    expect(errorText).toEqual('Scriptfehler: Version-Parameter Fehlerhaft!');
    dataService.setElements(['iqb-scripted::1.a'], {});
    errorText = (dataService.rootBlock.elements[0] as UIElement).properties.get(PropertyKey.TEXT);
    expect(errorText).toEqual('Scriptfehler: Version-Parameter Fehlerhaft!');
    dataService.setElements(['iqb-scripted::a.1'], {});
    errorText = (dataService.rootBlock.elements[0] as UIElement).properties.get(PropertyKey.TEXT);
    expect(errorText).toEqual('Scriptfehler: Version-Parameter Fehlerhaft!');

    dataService.setElements(['iqb-scripted::0.1'], {});
    errorText = (dataService.rootBlock.elements[0] as UIElement).properties.get(PropertyKey.TEXT);
    expect(errorText).toEqual('Scriptfehler: Scriptversion nicht unterstützt (erste Zeile)!' +
                              'Unterstützte Versionen: 1');
  });
});
