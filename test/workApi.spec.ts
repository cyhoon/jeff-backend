import { describe, it } from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import testServer from '../src/testServer';

chai.use(chaiHttp);

const { expect } = chai;
const apiUrl = '/api/work';
const workHistoryMonthUrl = `${apiUrl}/history/month`;
const workHistory = `${apiUrl}/history`;

describe('work api 테스트', () => {
  describe('[GET] /work/history/month/:month 테스트', () => {
    it('month 날짜를 보내지 않았을 때 404가 나와야함', (done) => {
      chai.request(testServer)
        .get(workHistoryMonthUrl)
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(404);
          done();
        });
    });

    it('month 파라미터가 유효하지 않는 포맷일때 400이 나와야함', (done) => {
      chai.request(testServer)
        .get(workHistoryMonthUrl + '/3ab')
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(400);
          done();
        });
    });

    it('month 파라티머가 정상일때 응답 값으로 배열이 넘어와야함', (done) => {
      chai.request(testServer)
        .get(workHistoryMonthUrl+ '/2018-12')
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response.body.data.workHistories).to.be.an('array');
          done();
        });
    });
  });

  describe('[POST] /work/history 테스트', () => {
    it('요청파라미터가 없다면 응답 상태 코드는 400이다', (done) => {
      chai.request(testServer)
        .post(workHistory)
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(400);
          done();
        });
    });

    it('요청파라미터가 유효하지 않다면 응답 상태 코드는 400이다', (done) => {
      chai.request(testServer)
        .post(workHistory)
        .send({ workType: 1 })
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(400);
          done();
        });
    });

    it('요청파라미터를 알맞게 보내면 응답 상태 코드는 200이다', (done) => {
      chai.request(testServer)
        .post(workHistory)
        .send({ workType: 'start' })
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          done();
        });
    });
  });
});
